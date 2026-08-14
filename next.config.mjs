/** @type {import('next').NextConfig} */
const nextConfig = {
  // Emit a fully static site into out/ so it can be hosted anywhere,
  // including GitHub Pages, with no Node server.
  output: 'export',
  images: { unoptimized: true },
};

export default nextConfig;
