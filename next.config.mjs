/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Remove basePath when avert.net.au domain is pointed at this repo
  basePath: '/avert-website',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

export default nextConfig
