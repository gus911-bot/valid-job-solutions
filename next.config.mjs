/** @type {import('next').NextConfig} */
import bundleAnalyzer from '@next/bundle-analyzer';

// Analyse du bundle : ANALYZE=true npm run build (voir script `analyze`).
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

// En-têtes de sécurité appliqués à toutes les routes.
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    // CSP de base : autorise Supabase, Unsplash et les inline styles nécessaires à Next/Tailwind.
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // 'unsafe-eval' n'est requis qu'en dev (Fast Refresh). Retiré en production.
      process.env.NODE_ENV === 'production'
        ? "script-src 'self' 'unsafe-inline'"
        : "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://images.unsplash.com https://*.supabase.co https://*.google.com https://*.gstatic.com https://*.googleapis.com https://*.ggpht.com",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
      "frame-src https://www.google.com https://maps.google.com",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
];

const nextConfig = {
  reactStrictMode: true,
  // Sortie autonome pour Docker uniquement. Sur Vercel (build natif), on laisse
  // la valeur par défaut — `standalone` peut perturber le bundling des fonctions.
  output: process.env.VERCEL ? undefined : 'standalone',
  poweredByHeader: false,
  compress: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default withBundleAnalyzer(nextConfig);
