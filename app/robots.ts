import { MetadataRoute } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://allsportsintelligence.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/user_dashboard/',
          '/modify/',
          '/_next/',
          '/admin/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/user_dashboard/',
          '/modify/',
          '/admin/',
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}