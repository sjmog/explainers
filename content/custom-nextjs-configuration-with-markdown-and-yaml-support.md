# Custom Next.js Configuration with Markdown and YAML Support

```typescript annotate
// Import the createMDX function from the '@next/mdx' module
import createMDX from '@next/mdx'

// TypeScript type annotation for the Next.js configuration object
/** @type {import('next').NextConfig} */

// Define the Next.js configuration object
const nextConfig = {
  // Override the default webpack configuration
  webpack: (config) => {
    // Add custom module rules to handle `.md` and `.yaml` files
    config.module.rules.push(
      {
        test: /\.md$/,     // Match all Markdown files
        use: 'raw-loader'  // Use 'raw-loader' to import Markdown files as strings
      },
      {
        test: /\.ya?ml$/,  // Match all `.yml` and `.yaml` files
        use: 'yaml-loader' // Use 'yaml-loader' to convert YAML files to JSON
      }
    )
    // Return the modified webpack configuration
    return config
  },
  // Configure SASS options
  sassOptions: {
    quietDeps: true, // Suppress warnings from SASS dependencies
    logger: {
      warn: () => {},  // Suppress SASS warning messages
      debug: () => {}, // Suppress SASS debug messages
    },
  }
};

// Export the Next.js configuration object as the default export
export default nextConfig;
```