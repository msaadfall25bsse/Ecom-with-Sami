import { NextRequest, NextResponse } from 'next/server';
import os from 'os';
import path from 'path';
import fs from 'fs';

interface ActiveSession {
  ip: string;
  path: string;
  country: string;
  lastSeen: number;
}

const MEMORY_SESSIONS = new Map<string, ActiveSession>();
const CACHE_FILE = path.join(os.tmpdir(), 'ecom_realtime_sessions.json');

function loadSessionsFromFile(): void {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, 'utf-8');
      const list = JSON.parse(raw);
      if (Array.isArray(list)) {
        const cutoff = Date.now() - 5 * 60 * 1000;
        for (const item of list) {
          if (item && item.ip && item.lastSeen > cutoff) {
            MEMORY_SESSIONS.set(item.ip, item);
          }
        }
      }
    }
  } catch {
    // Ignore cache read errors
  }
}

function saveSessionsToFile(): void {
  try {
    const list = Array.from(MEMORY_SESSIONS.values());
    fs.writeFileSync(CACHE_FILE, JSON.stringify(list), 'utf-8');
  } catch {
    // Ignore cache write errors
  }
}

// Initial load on server module startup
loadSessionsFromFile();

export async function POST(req: NextRequest) {
  try {
    let body: { path?: string } = {};
    try {
      body = await req.json();
    } catch {
      // Body may be empty or beacon
    }

    const currentPath = body.path || '/';
    const forwardedFor = req.headers.get('x-forwarded-for') || '';
    const realIp = req.headers.get('x-real-ip') || '';
    const cfCountry = req.headers.get('cf-ipcountry') || 'Pakistan';
    const userAgent = req.headers.get('user-agent') || 'browser';

    const clientIdentifier = `${forwardedFor.split(',')[0].trim() || realIp || 'client'}-${userAgent.slice(0, 32)}`;
    const now = Date.now();

    MEMORY_SESSIONS.set(clientIdentifier, {
      ip: clientIdentifier,
      path: currentPath,
      country: cfCountry === 'XX' || !cfCountry ? 'Pakistan' : cfCountry,
      lastSeen: now,
    });

    // Cleanup sessions inactive for > 5 minutes
    const cutoff = now - 5 * 60 * 1000;
    for (const [key, session] of MEMORY_SESSIONS.entries()) {
      if (session.lastSeen < cutoff) {
        MEMORY_SESSIONS.delete(key);
      }
    }

    saveSessionsToFile();

    return NextResponse.json({ success: true, count: MEMORY_SESSIONS.size });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export function getActiveRealtimeSessions() {
  const now = Date.now();
  const cutoff = now - 5 * 60 * 1000;

  loadSessionsFromFile();

  const active: ActiveSession[] = [];
  for (const session of MEMORY_SESSIONS.values()) {
    if (session.lastSeen >= cutoff) {
      active.push(session);
    }
  }

  return active;
}
