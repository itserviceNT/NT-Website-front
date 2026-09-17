import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Without this, `next dev` blocks cross-origin requests to dev assets, so
  // opening the site from a phone on the LAN loads the HTML but never
  // hydrates. Hostnames only — no scheme, no port.
  allowedDevOrigins: ['192.168.1.*', '10.0.0.*', '*.local'],
  experimental: {
    // The root layout lives under the [locale] segment, so there is no
    // non-dynamic layout for a route-level not-found.tsx to compose with.
    // This is the case the Next docs point at global-not-found for.
    globalNotFound: true,
  },
}

export default nextConfig
