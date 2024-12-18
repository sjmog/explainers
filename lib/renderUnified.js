import { createProcessor } from './processor.js'

export async function renderUnified(markdown) {
// creates a processor, the context is used for rewriting English Headings...maybe get rid?
  const processor = createProcessor()
  // template is the markdown file
  const vFile = await processor.process(markdown)
  let html = vFile.toString()
  return html.trim()
}
