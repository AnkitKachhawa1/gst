/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    basePath: '/tool',
    assetPrefix: 'https://gst-reco-new.vercel.app/tool',
    images: {
        unoptimized: true
    }
};

module.exports = nextConfig;
