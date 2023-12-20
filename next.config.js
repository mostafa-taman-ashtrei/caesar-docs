/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.resolve.alias.canvas = false;
        config.resolve.alias.encoding = false;
        return config;
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "\"lh3.googleusercontent.com\"",
                port: "",

            },
        ],
    }
};

module.exports = nextConfig;
