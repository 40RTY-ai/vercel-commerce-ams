export default {
  experimental: {
    ppr: true,
    inlineCss: true,
    useCache: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/s/files/**",
      },
    ],
  },
  // The agentic deployment (FORTY_AGENTIC=1) serves the agentic webpage at
  // `/`; every other route stays the store's. The store's own build is unchanged.
  async rewrites() {
    return process.env.FORTY_AGENTIC === "1"
      ? { beforeFiles: [{ source: "/", destination: "/forty" }] }
      : [];
  },
};
