import fs from 'fs'

const file = fs.readFileSync('./lib/image-density.txt', 'utf8')

export const IMAGE_DENSITY = Object.fromEntries(
  file.split('\n').map((line) => {
    const [path, density] = line.split(' ')
    return [path, density]
  }),
)
