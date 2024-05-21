/** @type {import('next').NextConfig} */
await import("./src/env.js");

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-964af75ad9e34b1ca36939018d122846.r2.dev",
      },
    ],
  },
};

export default nextConfig;
