import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb", 
      allowedOrigins: [
        "localhost:3000", 
      ]
    },
    
    // Otras configuraciones experimentales
    optimizePackageImports: ["@mui/material", "@mui/icons-material"]
  }
};

export default nextConfig;