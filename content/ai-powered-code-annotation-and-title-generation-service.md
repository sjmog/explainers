# AI-Powered Code Annotation and Title Generation Service

import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    const { code } = await request.json();

    const titleResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o', // or your desired model
        messages: [
            { role: 'system', content: 'Give a descriptive title for this code.' },
            { role: 'user', content: title }
        ],
      }),
    });

    const titleData = await titleResponse.json();
    const title = titleData.choices?.[0]?.message?.content || title;
    
    // Convert title to kebab-case for filename
    const filename = title.toLowerCase().replace(/\s+/g, '-');

    const ANNOTATION_FRAMEWORK = fs.readFileSync(path.join(process.cwd(), "data", `ANNOTATION_FRAMEWORK.md`), "utf8");
    
    // Call O1 model with fetch to transform the code
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'o1',
        messages: [
          { role: 'system', content: `Explain and annotate this code using the Github Docs Code Annotation framework. ${ANNOTATION_FRAMEWORK}` },
          { role: 'user', content: code },
        ],
      }),
    });
    const data = await response.json();
    const transformedCode = data.choices?.[0]?.message?.content || code;
    
    // Create markdown content with the transformed code
    const markdownContent = `# ${title}\n\n${transformedCode}`;
    
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