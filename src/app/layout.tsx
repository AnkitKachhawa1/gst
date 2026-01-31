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
    default: "Free GSTR-2B Reconciliation Tool | Robust, Secure & Unlimited | Ankit Kachhawa",
    template: "%s | Ankit Kachhawa"
  },
  description: "100% Free GSTR-2B Reconciliation Tool. Instantly match Purchase Register (Excel) with GSTR-2B (JSON). Robust, private, and secure - runs in your browser with no data upload.",
  keywords: ["Free GSTR-2B Tool", "GST Reconciliation Software Free", "Match GSTR-2B with Excel", "GST Matching Tool", "Ankit Kachhawa", "Robust GST Tool", "Secure GST Reconciliation"],
  authors: [{ name: "Ankit Kachhawa", url: "https://ankitkachhawa.in" }],
  creator: "Ankit Kachhawa",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://ankitkachhawa.in/tools",
    title: "Free GSTR-2B Reconciliation Tool | Robust & Secure",
    description: "Reconcile unlimited invoices for free. Secure client-side processing - your data never leaves your device.",
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
    title: "Free GSTR-2B Reconciliation Tool | Robust & Secure",
    description: "Reconcile unlimited invoices for free. Secure client-side processing - your data never leaves your device.",
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
    "name": "GSTR-2B Reconciler",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "description": "A browser-based tool for reconciling GSTR-2B data with purchase books securely.",
    "author": {
      "@type": "Person",
      "name": "Ankit Kachhawa"
    }
  };

  return (
    <html lang="en">
      <body className="bg-slate-50 font-sans text-slate-900 antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Fixed Header */}
        <Header />
        
        {/* Main Content with top padding to account for fixed header */}
        <main className="flex-grow flex flex-col pt-[240px] min-h-screen">
          {children}
        </main>
        
        <Footer />
      </body>
    </html>
  );
}
