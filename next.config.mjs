/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // ESLint v9 호환성 문제 임시 해결
    ignoreDuringBuilds: false,
  },
}

export default nextConfig