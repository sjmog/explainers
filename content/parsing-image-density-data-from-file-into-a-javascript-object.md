# Parsing Image Density Data from File into a JavaScript Object

The following code reads a text file named `image-density.txt` and constructs an object mapping image paths to their respective density values.

```javascript annotate
// Import the built-in 'fs' module from Node.js to handle file system operations
import fs from 'fs'

// Read the contents of './lib/image-density.txt' as a UTF-8 encoded string
const file = fs.readFileSync('./lib/image-density.txt', 'utf8')

// Process the file content and create an object mapping paths to densities
export const IMAGE_DENSITY = Object.fromEntries(
  // Split the file content into an array of lines and transform each line
  file.split('\n').map((line) => {
    // Split each line by space to get the 'path' and 'density' values
    const [path, density] = line.split(' ')
    // Return a [key, value] pair for each entry in the object
    return [path, density]
  }),
)
```