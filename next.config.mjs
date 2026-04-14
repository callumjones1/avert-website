/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Remove basePath when avert.net.au domain is pointed at this repo
  basePath: '/avert-website',
  trailingSlash: true,
  images: {
    loader: 'custom',
    loaderFile: './lib/image-loader.js',
  },
}

export default nextConfig
