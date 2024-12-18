# "Custom Webpack Configuration for MD and YAML File Processing in Next.js with Silent SASS Logging"

## Annotated Code Example

The following code example configures a Next.js project to handle Markdown and YAML files using custom Webpack rules and customizes Sass options to suppress certain warnings.

### Rendered example

```javascript
// Import the createMDX function from the '@next/mdx' package
import createMDX from '@next/mdx'
```

*Imports the `createMDX` function from the `@next/mdx` package to enable MDX support in Next.js.*

```javascript
// Define the Next.js configuration object with type annotation
/** @type {import('next').NextConfig} */
const nextConfig = {
```

*Defines the Next.js configuration object with proper type annotations for better tooling and type checking.*

```javascript
  // Customize the Webpack configuration
  webpack: (config) => {
```

*Adds a custom Webpack configuration function to modify the default Next.js Webpack settings.*

```javascript
    // Add custom rules to handle .md and .yaml files
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
```

*Pushes new rules into Webpack's module rules to handle Markdown (`.md`) files with `raw-loader` and YAML (`.yaml` or `.yml`) files with `yaml-loader`.*

```javascript
  // Configure Sass options
  sassOptions: {
    quietDeps: true,
    logger: {
      warn: () => {},
      debug: () => {},
    },
  }
};
```

*Configures Sass options to suppress warnings from dependencies and disables logging for warnings and debug messages.*

```javascript
// Export the Next.js configuration as the default export
export default nextConfig;
```

*Exports the configured Next.js configuration object as the default export for use by Next.js.*

### Raw code example

```javascript annotate
// Import the createMDX function from the '@next/mdx' package
import createMDX from '@next/mdx'

// Define the Next.js configuration object with type annotation
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Customize the Webpack configuration
  webpack: (config) => {
    // Add custom rules to handle .md and .yaml files
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
  // Configure Sass options
  sassOptions: {
    quietDeps: true,
    logger: {
      warn: () => {},
      debug: () => {},
    },
  }
};

// Export the Next.js configuration as the default export
export default nextConfig;
```