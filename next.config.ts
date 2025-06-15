import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "paper-dev-test-magic-pdf-input.s3.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          "http://ec2-43-202-9-100.ap-northeast-2.compute.amazonaws.com:8080/api/:path*",
      },
    ];
  },
};

export default nextConfig;
