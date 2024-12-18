# some code

```
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    const { title, code } = await request.json();
    
    // Convert title to kebab-case for filename
    const filename = title.toLowerCase().replace(/\s+/g, '-');
    
    // Create markdown content
    const markdownContent = `# ${title}\n\n\`\`\`\n${code}\n\`\`\``;
    
    // Write to file
    const filePath = path.join(process.cwd(), 'content', `${filename}.md`);
    await fs.writeFile(filePath, markdownContent);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating example:', error);
    return NextResponse.json(
      { error: 'Failed to create example' },
      { status: 500 }
    );
  }
}
```