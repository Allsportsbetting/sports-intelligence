import Script from 'next/script';

interface StructuredDataProps {
  data: Record<string, any>;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Predefined structured data for common pages
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "All Sports Intelligence",
  "description": "Interactive world map and sports data visualization platform providing real-time global sports intelligence.",
  "url": process.env.NEXT_PUBLIC_SITE_URL || "https://allsportsintelligence.com",
  "logo": `${process.env.NEXT_PUBLIC_SITE_URL || "https://allsportsintelligence.com"}/icon-512.png`,
  "sameAs": [
    // Add social media URLs when available
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": "English"
  }
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "All Sports Intelligence",
  "description": "Interactive world map and sports data visualization platform",
  "url": process.env.NEXT_PUBLIC_SITE_URL || "https://allsportsintelligence.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${process.env.NEXT_PUBLIC_SITE_URL || "https://allsportsintelligence.com"}?q={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  }
};

export const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "All Sports Intelligence",
  "description": "Interactive world map and real-time sports data visualization platform",
  "url": process.env.NEXT_PUBLIC_SITE_URL || "https://allsportsintelligence.com",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "2.00",
    "priceCurrency": "USD",
    "description": "Premium membership with exclusive benefits"
  },
  "featureList": [
    "Real-time world map visualization",
    "Interactive data visualization",
    "Premium sports intelligence",
    "Live data updates",
    "Admin-driven unlock mechanism"
  ]
};