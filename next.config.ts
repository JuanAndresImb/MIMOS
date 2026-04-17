import type { NextConfig } from "next";
import path from "path";
import createNextIntlPlugin from "next-intl/plugin";
import { withSentryConfig } from "@sentry/nextjs";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const securityHeaders = [
  // Force HTTPS pendant 1 an, inclut les sous-domaines
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  // Empêche le clickjacking — refuse l'affichage dans un iframe
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // Empêche le MIME sniffing
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Referrer policy restrictive
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Permissions policy — désactive les APIs sensibles
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  // CSP de base — renforcé en production
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-eval requis par Next.js dev
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self'",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.mollie.com",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default withSentryConfig(withNextIntl(nextConfig), {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Supprime les logs Sentry pendant le build sauf en CI
  silent: !process.env.CI,

  // Upload source maps vers Sentry pour les stack traces déminifiées
  widenClientFileUpload: true,

  // Tunnel les requêtes Sentry via l'app pour éviter les bloqueurs de pubs
  tunnelRoute: "/monitoring",

  webpack: {
    // Supprime les logs Sentry côté client en production
    treeshake: { removeDebugLogging: true },
    // Moniteurs Vercel Cron automatiques
    automaticVercelMonitors: true,
  },
});
