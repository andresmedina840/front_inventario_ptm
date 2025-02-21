// next.config.js
const nextConfig = {
  // Configuración para el directorio app (Next.js 13+)
  appDir: true, // ✅ Ya no está en "experimental"

  // Optimizaciones para MUI y styled-components
  compiler: {
    styledComponents: true
  },

  // Configuración para Docker
  output: "standalone",

  // Configuraciones experimentales específicas
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
      allowedOrigins: [
        "localhost:3000",
        process.env.NEXT_PUBLIC_API_URL
      ]
    },
    optimizePackageImports: ["@mui/material", "@mui/icons-material"]
  }
};

export default nextConfig;