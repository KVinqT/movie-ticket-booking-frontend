import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
      {
        protocol: "https",
        hostname: "cdn1.epicgames.com",
        pathname: "/**",
      },
      // Added both the base and the specific Play Store subdomain
      {
        protocol: "https", // Switched to https as it's more standard
        hostname: "googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "play-lh.googleusercontent.com", // The hostname from your error
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "image.api.playstation.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn2.penguin.com.au",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
