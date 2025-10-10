import type { NextConfig } from "next";

// eslint-disable-next-line @typescript-eslint/no-var-requires


const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'xyhxyuvexzzkilkbdjwf.supabase.co',
                pathname: '/storage/v1/object/public/company_assets/**',
            }
        ],
      },
};

export default nextConfig;
