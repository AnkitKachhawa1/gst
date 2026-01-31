# Project Context: GSTR-2B Reconciler Tool

## 📌 Overview
A high-performance, 100% client-side web application built with **Next.js (App Router)** and **TypeScript**. It allows tax professionals and businesses to reconcile GSTR-2B data (from JSON files) with their internal Purchase Registers (from Excel files) securely in the browser.

## 🏗️ Architecture & Deployment
- **Main Domain Integration:** The tool is hosted on Vercel but integrated into the main site (`ankitkachhawa.in`) via a **Vercel Rewrite**.
  - **Public URL:** `https://ankitkachhawa.in/tools`
  - **Direct URL:** `https://gst-reco-new.vercel.app/tool`
- **Build Strategy:** Static Export (`output: 'export'`).
- **Path Configuration:**
  - `basePath`: `/tool` (Internal Next.js routing)
  - `assetPrefix`: `https://gst-reco-new.vercel.app/tool` (Ensures CSS/JS load correctly when proxied via the main domain).
- **Post-Build Script:** `scripts/move-export.js` moves the `out/` content into an `out/tool/` subfolder to match the `basePath` requirement for static hosting.

## 🚀 Key Features
- **Privacy First:** All processing happens in the user's browser using `exceljs`, `xlsx`, and local JSON parsing. No data is ever uploaded to a server.
- **Smart Mapping:** Automatic header detection for Excel files to map GSTIN, Invoice Date, and Values.
- **Tiered Matching:** Uses a reconciliation engine that matches invoices by Exact, Inferred, and Manual review categories.
- **Reporting:** Generates a comprehensive Excel report with matching status and discrepancies.

## 🔍 SEO Strategy
- **Canonical URL:** Fixed to `https://ankitkachhawa.in/tools` to ensure all search engine "juice" goes to the main domain.
- **Metadata:** Optimized for terms like "Free GSTR-2B Reconciliation," "Robust GST Tool," and "Secure Matching."
- **Social Preview:** Uses `public/gstr2bb.png` for professional Open Graph and Twitter Card previews.
- **Semantic HTML:** Uses `<h1>` for the main tool title and JSON-LD `SoftwareApplication` schema.

## 🛠️ Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Data Handling:** `exceljs`, `xlsx`, `lodash`, `uuid`
- **Deployment:** Vercel

## ⚠️ Maintenance Notes
- **Updating Code:** When making changes, always run `npm run build` to ensure the `move-export.js` script restructures the files correctly.
- **Main Site Links:** Navigation on the main site MUST use standard `<a>` tags for `/tools` to bypass React Router and trigger the Vercel Rewrite.
- **Asset Paths:** If adding new images to `public/`, ensure they are referenced via `/tools/image-name.png` in metadata to account for the rewrite.
