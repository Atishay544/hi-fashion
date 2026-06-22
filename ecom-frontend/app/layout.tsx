import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? ''

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.hifashions.shop'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Hi Fashion — Trendy Clothing & Fashion Online India",
    template: "%s | Hi Fashion",
  },
  icons: {
    icon: [
      { url: '/lf-logo.png', type: 'image/png' },
    ],
    apple: '/lf-logo.png',
    shortcut: '/lf-logo.png',
  },
  description: "Shop the latest fashion online at Hi Fashion. Trendy clothing, accessories, and more. Free shipping above ₹499. 7-day returns. Trusted across India.",
  keywords: [
    "hi fashion", "hi-fashions", "hifashions", "hifashions.shop",
    "fashion online india", "buy clothes online india", "trendy clothing india",
    "fashion store india", "online fashion india", "clothing shop india",
    "free shipping fashion india", "stylish clothes india", "fashion shopping india",
  ],
  authors: [{ name: "Parv Jain", url: BASE_URL }],
  creator: "Parv Jain",
  publisher: "Hi-Fashions",
  category: "ecommerce",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "Hi Fashion",
    title: "Hi Fashion — Trendy Clothing & Fashion Online India",
    description: "Shop the latest fashion online at Hi Fashion. Free shipping on orders above ₹499.",
    images: [
      {
        url: `/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Hi Fashion — Trendy Clothing & Fashion Online India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hi Fashion — Trendy Clothing & Fashion Online India",
    description: "Shop the latest fashion online at Hi Fashion. Free shipping above ₹499.",
    images: [`/opengraph-image`],
  },
  alternates: {
    canonical: BASE_URL,
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
    // Add your Google Search Console verification token here once you have it
    // google: 'your-verification-token',
  },
};

// Organization + WebSite + OnlineStore JSON-LD
const orgJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "OnlineStore"],
      "@id": `${BASE_URL}/#organization`,
      name: "Hi Fashion",
      alternateName: ["Hi-Fashions"],
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        "@id": `${BASE_URL}/#logo`,
        url: `${BASE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        caption: "Hi Fashion",
      },
      image: { "@id": `${BASE_URL}/#logo` },
      description: "Shop the latest fashion online at Hi Fashion. Trendy clothing and accessories. Free shipping above ₹499. 7-day returns. Pan-India delivery.",
      founder: { "@type": "Person", name: "Parv Jain" },
      foundingDate: "2024",
      areaServed: { "@type": "Country", name: "India" },
      contactPoint: [
        {
          "@type": "ContactPoint",
          email: "parvjain012@gmail.com",
          telephone: "+918979013817",
          contactType: "customer support",
          availableLanguage: ["English", "Hindi"],
          areaServed: "IN",
        },
        {
          "@type": "ContactPoint",
          email: "parvjain012@gmail.com",
          contactType: "sales",
          availableLanguage: ["English", "Hindi"],
          areaServed: "IN",
        },
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Fashion & Clothing",
        itemListElement: [
          { "@type": "OfferCatalog", name: "Men's Fashion", url: `${BASE_URL}/products` },
          { "@type": "OfferCatalog", name: "Women's Fashion", url: `${BASE_URL}/products` },
          { "@type": "OfferCatalog", name: "Kids' Fashion", url: `${BASE_URL}/products` },
          { "@type": "OfferCatalog", name: "Accessories", url: `${BASE_URL}/products` },
        ],
      },
      sameAs: [
        "https://www.hifashions.shop",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "Hi Fashion",
      description: "Shop the latest fashion online at Hi Fashion. Free shipping above ₹499.",
      inLanguage: "en-IN",
      publisher: { "@id": `${BASE_URL}/#organization` },
      potentialAction: [
        {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      ],
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}<Analytics /></body>
      {GA_ID && <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />}
      {GA_ID && <Script id="ga4-init" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_ID}', { send_page_view: true });
      `}} />}
    </html>
  );
}
