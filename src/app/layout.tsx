import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/MainSiteHeader";
import Footer from "@/components/MainSiteFooter";

export const metadata: Metadata = {
  metadataBase: new URL('https://ankitkachhawa.in'),
  alternates: {
    canonical: '/tools',
  },
  title: {
    default: "Free GSTR-2B Reconciliation Tool India | Fast & Secure JSON to Excel Match",
    template: "%s | Ankit Kachhawa"
  },
  description: "Best Free GSTR-2B Reconciliation Tool in India. Securely match GST Purchase Register (Excel) with GSTR-2B (JSON) instantly in your browser. No signup, no data upload. Trusted by CAs in Gujarat & Mumbai.",
  keywords: [
    "Free GSTR-2B Reconciliation Tool", 
    "GSTR-2B vs Purchase Register Match", 
    "GST Matching Software Free India", 
    "GSTR-2B Excel Utility 2025", 
    "GST Tool Gujarat", 
    "Tax Reconciliation Ahmedabad", 
    "Secure GST Tool"
  ],
  authors: [{ name: "Ankit Kachhawa", url: "https://ankitkachhawa.in" }],
  creator: "Ankit Kachhawa",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://ankitkachhawa.in/tools",
    title: "Free GSTR-2B Reconciliation Tool | Secure & Private",
    description: "Reconcile GSTR-2B with Purchase Register instantly. 100% Free, Browser-based (No Data Upload). Ideal for CAs and Accountants in India.",
    siteName: "Ankit Kachhawa Financial Services",
    images: [
      {
        url: "/tools/gstr2bb.png",
        width: 1200,
        height: 630,
        alt: "Free GSTR-2B Reconciliation Tool Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free GSTR-2B Reconciliation Tool | Secure & Private",
    description: "Reconcile GSTR-2B with Purchase Register instantly. 100% Free, Browser-based. #GST #India #FinTech",
    images: ["/tools/gstr2bb.png"],
    creator: "@iAnkitKachhawa",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "GSTR-2B Reconciler India",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "description": "A secure, browser-based tool for reconciling GSTR-2B data with purchase books. Optimized for Indian GST compliance.",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "150"
    },
    "featureList": "Drag & Drop JSON/Excel, Instant Matching, Privacy-First (Local Processing), Excel Export",
    "author": {
      "@type": "Person",
      "name": "Ankit Kachhawa",
      "url": "https://ankitkachhawa.in"
    },
    "spatialCoverage": "IN"
  };

  return (
    <html lang="en">
      <body className="bg-slate-50">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
