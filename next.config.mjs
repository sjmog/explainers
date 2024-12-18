/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push(
      {
        test: /\.md$/,
        use: 'raw-loader'
      },
      {
        test: /\.ya?ml$/,
        use: 'yaml-loader'
      }
    )
    return config
  },
  sassOptions: {
    quietDeps: true,
    logger: {
      warn: () => {},
      debug: () => {},
    },
  }
};

export default nextConfig;
