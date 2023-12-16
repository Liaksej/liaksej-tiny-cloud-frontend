// const { env } = require("eslint-config-next");
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  async rewrites() {
    return {
      afterFiles: [
        {
          source: "/public/:path*",
          destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}cloud/public/:path*/`,
        },
      ],
    };
  },
};

module.exports = nextConfig;
