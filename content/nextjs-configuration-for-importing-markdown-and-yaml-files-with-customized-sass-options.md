# Next.js Configuration for Importing Markdown and YAML Files with Customized SASS Options

```javascript annotate
// Importing the createMDX function from the '@next/mdx' package to enable MDX support in the Next.js application.
import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
// Defining the Next.js configuration object with TypeScript type annotations for better tooling support.
const nextConfig = {
  // Customizing the Webpack configuration used by Next.js.
  webpack: (config) => {
    // Adding custom rules to the Webpack configuration.
    config.module.rules.push(
      {
        // Applying the 'raw-loader' to .md files, allowing Markdown files to be imported as raw strings.
        test: /\.md$/,  
        use: 'raw-loader'
      },
      {
        // Applying the 'yaml-loader' to .yml and .yaml files to load them as JavaScript objects.
        test: /\.ya?ml$/,  
        use: 'yaml-loader'
      }
    );
    // Returning the modified Webpack configuration.
    return config;
  },
  // Configuration options for Sass, a CSS preprocessor.
  sassOptions: {
    // Prevents warnings from dependencies from being displayed in the console.
    quietDeps: true,
    logger: {
      // Custom warning logger that does nothing.
      warn: () => {},
      // Custom debug logger that does nothing.
      debug: () => {},
    },
  }
};

// Exporting the Next configuration object for use in the Next.js app.
export default nextConfig;
```

### Explanation of Annotations:
1. **Importing MDX Support**: The first line shows how to import the `createMDX` function from the `@next/mdx` package which is essential for enabling MDX support in Next.js applications, allowing Markdown to be used seamlessly with React components.

2. **Next.js Configuration Object**: The `nextConfig` object holds the configuration settings for Next.js, and the comment explains the purpose and benefit of TypeScript type annotations.

3. **Custom Webpack Configuration**: The `webpack` property is a function that takes the existing configuration and allows modifications. Annotations explain the purpose of each block of configuration.

4. **Loading Markdown and YAML Files**: The example clarifies how to set up Webpack rules for handling `.md` and `.yaml/.yml` files with the appropriate loaders, enabling these files to be used directly in the application.

5. **Sass Options Configuration**: Provides options specific to Sass, including how to handle log messages related to dependency warnings and debug information. This part is important for production-level applications where unnecessary console output may be avoided.

6. **Exporting Configuration**: Finally, it notes that the configured object is being exported for use, which is a standard practice in module-based systems like Next.js.