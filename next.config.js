/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    basePath: '/tools/gstr2b-reco',
    assetPrefix: 'https://gst-reco-new.vercel.app/tools/gstr2b-reco',
    images: {
        unoptimized: true
    }
};

module.exports = nextConfig;
