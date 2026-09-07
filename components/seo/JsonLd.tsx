import React from 'react';

/**
 * Comprehensive Schema.org JSON-LD Structured Data
 * 
 * Implements Google-compliant structured data to trigger:
 * 1. Google Sitelinks (via SiteNavigationElement & ItemList)
 * 2. Google Sitelinks Searchbox (via WebSite & SearchAction)
 * 3. Knowledge Panel (via EducationalOrganization & Person)
 * 4. Rich Course Snippets (via Course & Offer)
 */
export function JsonLd() {
  const baseUrl = 'https://ecomwithsami.com';

  // 1. WebSite Schema with Sitelinks Searchbox
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: baseUrl,
    name: 'Ecom With Sami',
    alternateName: ['EcomWithSami', 'Ecom With Sami Dropshipping', 'Sami Dropshipping Course', 'www.ecomwithsami.com'],
    description: 'Master UAE & KSA Shopify dropshipping step-by-step in Urdu with mentor Sami.',
    publisher: {
      '@id': `${baseUrl}/#organization`
    },
    inLanguage: 'ur-PK',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/blogs?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };

  // 2. EducationalOrganization / Brand Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    '@id': `${baseUrl}/#organization`,
    name: 'Ecom With Sami',
    alternateName: 'Ecom With Sami Academy',
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/sami-logo.jpg`,
      width: 800,
      height: 800,
      caption: 'Ecom With Sami Logo'
    },
    image: `${baseUrl}/sami-logo.jpg`,
    description: 'Premier e-commerce training academy in Pakistan specializing in UAE, Saudi Arabia (KSA), and GCC Shopify dropshipping.',
    founder: {
      '@type': 'Person',
      name: 'Sami Ullah',
      jobTitle: 'E-commerce Mentor & Dropshipping Specialist',
      url: `${baseUrl}/about`,
      sameAs: [
        'https://www.youtube.com/@ecomwithsami',
        'https://www.instagram.com/ecomwithsami'
      ]
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Abbottabad',
      addressRegion: 'Khyber Pakhtunkhwa',
      addressCountry: 'PK'
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+92-333-0093269',
        contactType: 'customer service',
        availableLanguage: ['Urdu', 'English'],
        areaServed: ['PK', 'AE', 'SA']
      }
    ],
    sameAs: [
      'https://www.youtube.com/@ecomwithsami',
      'https://www.instagram.com/ecomwithsami',
      'https://www.tiktok.com/@ecomwithsami'
    ]
  };

  // 3. SiteNavigationElement (Explicit structure for Google Sitelinks generation)
  const siteNavigationSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: [
      {
        '@type': 'SiteNavigationElement',
        position: 1,
        name: 'Course Enrollment & Pricing',
        description: 'Complete UAE & KSA Shopify Dropshipping Mentorship Program for PKR 3,799',
        url: `${baseUrl}/enrollment`
      },
      {
        '@type': 'SiteNavigationElement',
        position: 2,
        name: 'Student LMS Classroom',
        description: 'Access HD video lectures, curriculum, resources, and live student dashboard',
        url: `${baseUrl}/lms`
      },
      {
        '@type': 'SiteNavigationElement',
        position: 3,
        name: 'About Mentor Sami',
        description: 'Meet mentor Sami, learn our training track record and mission across Pakistan',
        url: `${baseUrl}/about`
      },
      {
        '@type': 'SiteNavigationElement',
        position: 4,
        name: 'Recommended Apps & Tools',
        description: 'Shopify apps, Cash on Delivery automation, and store optimization tools',
        url: `${baseUrl}/apps`
      },
      {
        '@type': 'SiteNavigationElement',
        position: 5,
        name: 'Dropshipping Guides & Blogs',
        description: 'Latest guides, product hunting strategies, and GCC dropshipping tutorials',
        url: `${baseUrl}/blogs`
      },
      {
        '@type': 'SiteNavigationElement',
        position: 6,
        name: 'Student Help & Support',
        description: 'Official student help desk, ticket support, and WhatsApp query resolution',
        url: `${baseUrl}/support`
      }
    ]
  };

  // 4. Course Schema (Rich Educational Results)
  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'UAE & KSA Shopify Dropshipping Mentorship Program',
    description: 'Comprehensive, step-by-step practical Shopify dropshipping training in Urdu covering winning product hunting, verified GCC wholesale suppliers, Cash on Delivery (COD) setup, and high-ROI TikTok/Facebook ads.',
    provider: {
      '@type': 'EducationalOrganization',
      name: 'Ecom With Sami',
      sameAs: baseUrl
    },
    inLanguage: 'ur',
    educationalCredentialAwarded: 'Certificate of Course Completion',
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Online',
      courseWorkload: 'PT25H',
      inLanguage: 'ur'
    },
    offers: {
      '@type': 'Offer',
      price: '3799',
      priceCurrency: 'PKR',
      category: 'Paid',
      availability: 'https://schema.org/InStock',
      url: `${baseUrl}/enrollment`,
      validFrom: '2026-01-01'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavigationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
    </>
  );
}
