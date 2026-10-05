/** @type {import('next').NextConfig} */
const nextConfig = {
  // GitHub Pages sert le site sous /<repo>/ — le base path est injecté
  // par le workflow de déploiement (BASE_PATH env).
  basePath: process.env.BASE_PATH || "",
  // Export 100% statique : l'app n'a aucun backend.
  output: process.env.STATIC_EXPORT === "1" ? "export" : undefined,
};

export default nextConfig;
