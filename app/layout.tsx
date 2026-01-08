import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google';
import { StructuredData, organizationSchema, websiteSchema } from '@/components/StructuredData';
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://allsportsintelligence.com';

export const metadata: Metadata = {
  title: {
    default: "All Sports Intelligence - Interactive World Map & Data Visualization",
    template: "%s | All Sports Intelligence"
  },
  description: "Experience real-time global sports intelligence through our interactive world map. Track progress, visualize data, and unlock insights with our premium data-driven platform featuring elegant design and smooth animations.",
  keywords: [
    "sports intelligence",
    "world map",
    "data visualization", 
    "real-time analytics",
    "interactive map",
    "sports data",
    "global insights",
    "premium analytics"
  ],
  authors: [{ name: "All Sports Intelligence Team" }],
  creator: "All Sports Intelligence",
  publisher: "All Sports Intelligence",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: 'All Sports Intelligence - Interactive World Map & Data Visualization',
    description: 'Experience real-time global sports intelligence through our interactive world map. Track progress, visualize data, and unlock insights with our premium data-driven platform.',
    siteName: 'All Sports Intelligence',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'All Sports Intelligence - Interactive World Map',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Sports Intelligence - Interactive World Map & Data Visualization',
    description: 'Experience real-time global sports intelligence through our interactive world map. Track progress, visualize data, and unlock insights.',
    images: ['/og-image.jpg'],
    creator: '@allsportsintel',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Replace with actual verification code when available
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased font-sans">
        {children}
        <GoogleAnalytics gaId="G-QQ9X5X4NB8" />
        <StructuredData data={organizationSchema} />
        <StructuredData data={websiteSchema} />
      </body>
    </html>
  );
}
