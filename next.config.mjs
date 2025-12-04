/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.raveum.com",
      },
    ],
  },
};

export default nextConfig;
