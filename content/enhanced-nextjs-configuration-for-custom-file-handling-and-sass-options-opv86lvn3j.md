# Enhanced Next.js Configuration for Custom File Handling and Sass Options

The following code is a Next.js configuration file (`next.config.js`) that customizes the webpack configuration and Sass options. It adds support for importing Markdown and YAML files, and adjusts Sass settings to suppress certain warnings.

```javascript annotate
// The '@type' comment provides type definitions for Next.js configuration.
/** @type {import('next').NextConfig} */
// Define the Next.js configuration object.
const nextConfig = {
  // Customize the webpack configuration.
  webpack: (config) => {
    // Add new rules to handle '.md' and '.yml' files.
    config.module.rules.push(
      {
        // Use 'raw-loader' to load '.md' files as raw strings.
        test: /\.md$/,
        use: 'raw-loader'
      },
      {
        // Use 'yaml-loader' to load '.yml' and '.yaml' files as JSON.
        test: /\.ya?ml$/,
        use: 'yaml-loader'
      }
    );
    // Return the modified configuration.
    return config;
  },
  // Configure Sass options.
  sassOptions: {
    // Suppress deprecation warnings from dependencies.
    quietDeps: true,
    // Override the default Sass logger to suppress warnings and debug messages.
    logger: {
      // Suppress warning messages.
      warn: () => {},
      // Suppress debug messages.
      debug: () => {},
    },
  },
};

// Export the configuration as the default export.
export default nextConfig;
```