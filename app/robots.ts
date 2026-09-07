import { MetadataRoute } from 'next';

/**
 * Robots.txt Generator
 * Instructs search engine crawlers and points to the XML sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://ecomwithsami.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/',
          '/api/admin/',
          '/api/auth/',
          '/_next/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/',
          '/api/admin/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
