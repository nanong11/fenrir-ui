/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
})

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  compiler: {
    styledComponents: true,
    removeConsole: {
      exclude: process.env.NODE_ENV === 'production' ? ['error', 'warn'] : [],
    },
  },
  images: {
    domains: [
      'andvari-profile-images-dev.s3.ap-southeast-1.amazonaws.com',
      'andvari-post-images-dev.s3.ap-southeast-1.amazonaws.com',
      'andvari-profile-images-prod.s3.ap-southeast-1.amazonaws.com',
      'andvari-post-images-prod.s3.ap-southeast-1.amazonaws.com',
    ],
  },
}

module.exports = withPWA(nextConfig)
