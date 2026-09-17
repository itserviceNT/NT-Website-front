import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    // The root layout lives under the [locale] segment, so there is no
    // non-dynamic layout for a route-level not-found.tsx to compose with.
    // This is the case the Next docs point at global-not-found for.
    globalNotFound: true,
  },
}

export default nextConfig
