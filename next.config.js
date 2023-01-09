/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/rsrv',
        permanent: true,
      },
    ]
  }
}

module.exports = nextConfig
