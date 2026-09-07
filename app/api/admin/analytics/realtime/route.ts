import { NextResponse } from 'next/server';
import crypto from 'crypto';

// In-memory token cache to prevent requesting an OAuth token on every hit
let cachedToken: { accessToken: string; expiresAt: number } | null = null;

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

/**
 * Creates a signed Google OAuth 2.0 JWT assertion using native Node.js crypto.
 * No external heavy libraries required.
 */
function createSignedJwt(clientEmail: string, privateKey: string): string {
  const header = {
    alg: 'RS256',
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  const claimSet = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedClaimSet = base64UrlEncode(JSON.stringify(claimSet));
  const message = `${encodedHeader}.${encodedClaimSet}`;

  // Normalize private key line breaks if escaped
  const normalizedKey = privateKey.includes('\\n')
    ? privateKey.replace(/\\n/g, '\n')
    : privateKey;

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(message);
  signer.end();
  const signature = signer.sign(normalizedKey, 'base64');
  const encodedSignature = signature
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${message}.${encodedSignature}`;
}

/**
 * Exchanges JWT for a temporary Google OAuth 2.0 Bearer access token.
 */
async function getGoogleAccessToken(clientEmail: string, privateKey: string): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 60000) {
    return cachedToken.accessToken;
  }

  const assertion = createSignedJwt(clientEmail, privateKey);
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to obtain Google access token: ${errorBody}`);
  }

  const data = await response.json();
  cachedToken = {
    accessToken: data.access_token,
    expiresAt: now + (data.expires_in || 3600) * 1000,
  };

  return data.access_token;
}

/**
 * Strictly READ-ONLY endpoint for fetching Realtime GA4 visitor metrics.
 * Does NOT interact with or modify the MySQL or Supabase database.
 */
export async function GET() {
  const propertyId = process.env.GA_PROPERTY_ID?.trim() || '';
  let clientEmail = process.env.GA_CLIENT_EMAIL?.trim() || '';
  let privateKey = process.env.GA_PRIVATE_KEY?.trim() || '';

  // Optional JSON key configuration support
  const rawServiceAccount = process.env.GA_SERVICE_ACCOUNT_JSON?.trim();
  if (rawServiceAccount && (!clientEmail || !privateKey)) {
    try {
      const parsed = JSON.parse(rawServiceAccount);
      clientEmail = parsed.client_email || clientEmail;
      privateKey = parsed.private_key || privateKey;
    } catch {
      // Ignore JSON parse error and fallback to individual env variables
    }
  }

  const isConfigured = Boolean(propertyId && clientEmail && privateKey);

  if (!isConfigured) {
    return NextResponse.json({
      success: true,
      configured: false,
      activeUsers: 0,
      topPages: [],
      countries: [],
      message: 'Google Analytics Data API credentials not configured yet.',
      instructions: {
        step1: 'Create a Google Cloud Service Account and download the JSON key.',
        step2: 'Add the Service Account email to your GA4 property with Viewer role.',
        step3: 'Set GA_PROPERTY_ID, GA_CLIENT_EMAIL, and GA_PRIVATE_KEY in your .env file.',
      },
      lastUpdated: new Date().toISOString(),
    });
  }

  try {
    const accessToken = await getGoogleAccessToken(clientEmail, privateKey);

    // Call Google Analytics 4 Realtime Reporting API
    const response = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runRealtimeReport`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metrics: [{ name: 'activeUsers' }],
          dimensions: [{ name: 'unifiedScreenName' }, { name: 'country' }],
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json(
        {
          success: false,
          configured: true,
          error: `Google Analytics API Error: ${errText}`,
          activeUsers: 0,
        },
        { status: 502 }
      );
    }

    const data = await response.json();

    let totalActiveUsers = 0;
    const pagesMap: Record<string, number> = {};
    const countriesMap: Record<string, number> = {};

    if (Array.isArray(data.rows)) {
      for (const row of data.rows) {
        const page = row.dimensionValues?.[0]?.value || '/';
        const country = row.dimensionValues?.[1]?.value || 'Unknown';
        const users = parseInt(row.metricValues?.[0]?.value || '0', 10);

        totalActiveUsers += users;
        pagesMap[page] = (pagesMap[page] || 0) + users;
        countriesMap[country] = (countriesMap[country] || 0) + users;
      }
    }

    const topPages = Object.entries(pagesMap)
      .map(([path, activeUsers]) => ({ path, activeUsers }))
      .sort((a, b) => b.activeUsers - a.activeUsers)
      .slice(0, 5);

    const countries = Object.entries(countriesMap)
      .map(([country, activeUsers]) => ({ country, activeUsers }))
      .sort((a, b) => b.activeUsers - a.activeUsers)
      .slice(0, 5);

    return NextResponse.json({
      success: true,
      configured: true,
      activeUsers: totalActiveUsers,
      topPages,
      countries,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        configured: true,
        error: error?.message || 'Failed to query Google Analytics Data API',
        activeUsers: 0,
      },
      { status: 500 }
    );
  }
}
