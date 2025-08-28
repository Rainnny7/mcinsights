import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
    reactStrictMode: true,
    poweredByHeader: false,
    eslint: { ignoreDuringBuilds: true },
    typescript: { ignoreBuildErrors: true },
    devIndicators: false,
    experimental: {
        reactCompiler: true,
        authInterrupts: true,
    },
    transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"],
};
export default nextConfig;
