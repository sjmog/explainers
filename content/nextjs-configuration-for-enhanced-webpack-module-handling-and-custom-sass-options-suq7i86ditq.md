# Next.js Configuration for Enhanced Webpack Module Handling and Custom SASS Options

The following code example shows a Next.js configuration file that customizes the webpack settings to handle `.md` and `.yaml` files using specific loaders, and adjusts Sass options to suppress certain warnings.

```javascript annotate
// Export a Next.js configuration object with custom settings.
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Customize the webpack configuration.
  webpack: (config) => {
    // Add rules to process .md and .yaml files using specific loaders.
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
    // Return the modified config object.
    return config
  },
  // Customize Sass options.
  sassOptions: {
    // Suppress warnings about dependencies in Sass.
    quietDeps: true,
    // Disable warnings and debug messages from the Sass logger.
    logger: {
      warn: () => {},
      debug: () => {},
    },
  }
};

// Export the configuration as the default export.
export default nextConfig;
```