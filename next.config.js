/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      afterFiles: [
        {
          source: "/download/:path*",
          destination: `${process.env.NEXTAUTH_BACKEND_URL}cloud/download/:path*/`,
        },
        // {
        //   source: "/static/:path*",
        //   destination: "http://localhost:8000/static/:path*/",
        // },
      ],
    };
  },
};

module.exports = nextConfig;
