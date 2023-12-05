/** @type {import('next').NextConfig} */
const nextConfig = {
  // async rewrites() {
  //   return {
  //     afterFiles: [
  //       {
  //         source: "/admin/:path*",
  //         destination: "http://127.0.0.1:8000/admin/:path*/",
  //       },
  //       {
  //         source: "/static/:path*",
  //         destination: "http://localhost:8000/static/:path*/",
  //       },
  //     ],
  //   };
  // },
};

module.exports = nextConfig;
