# Automated Code Title Generation and Documentation Annotation with AI-Powered API Integration

```javascript annotate
// Import necessary modules for server response handling and file operations
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import yaml from "js-yaml";

// Define an asynchronous POST function to handle incoming requests
export async function POST(request) {
  try {
    // Extract 'code' from the request body
    const { code } = await request.json();

    // Generate a descriptive title from the code using OpenAI's API
    const titleResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o", // Specify the model to use
          messages: [
            {
              role: "system",
              content: "Give a descriptive title for this code.",
            },
            { role: "user", content: code },
          ],
        }),
      }
    );
    // Parse the response to obtain the generated title
    const titleData = await titleResponse.json();
    let title = titleData.choices?.[0]?.message?.content || "untitled";

    // Sanitize the title to create a URL-friendly filename
    const sanitizedTitle = title
      .normalize("NFD") // Normalize Unicode characters
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritical marks
      .replace(/[^\w\s-]/g, "") // Remove non-word characters except spaces and hyphens
      .trim()
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .toLowerCase();

    // Use the sanitized title as the filename, or fallback to "untitled"
    const filename = sanitizedTitle || "untitled";

    // Read the annotation framework from a local markdown file
    const ANNOTATION_FRAMEWORK = await fs.readFile(
      path.join(process.cwd(), "data", `ANNOTATION_FRAMEWORK.md`),
      "utf8"
    );

    // Load supported code languages from a YAML file
    const codeLanguagesFileContents = await fs.readFile(
      path.join(process.cwd(), "data", "code-languages.yml"),
      "utf8"
    );
    const codeLanguages = yaml.load(codeLanguagesFileContents);

    // Call the OpenAI API to transform the code using the O1 model
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "o1-preview",
        messages: [
          {
            role: "user",
            content: `Explain and annotate this code using the Github Docs Code Annotation framework. CODE: ${code} ANNOTATION_FRAMEWORK: ${ANNOTATION_FRAMEWORK} When marking code blocks, you may use only the following languages: ${Object.keys(
              codeLanguages
            ).join(", ")}`,
          },
        ],
      }),
    });
    // Parse the response from the OpenAI API
    const data = await response.json();
    console.log(data);

    // Use the transformed code from the response, or fallback to the original code
    const transformedCode = data.choices?.[0]?.message?.content || code;

    // Create markdown content with the title and transformed code
    const markdownContent = `# ${title}\n\n${transformedCode}`;

    // Write the markdown content to a file in the "content" directory
    const filePath = path.join(process.cwd(), "content", `${filename}.md`);
    await fs.writeFile(filePath, markdownContent);

    // Return a JSON response with the filename as the ID
    return NextResponse.json({ id: filename });
  } catch (error) {
    // Log any errors that occur during processing
    console.error("Error creating example:", error);
    // Return a JSON response with an error message and status code 500
    return NextResponse.json(
      { error: "Failed to create example" },
      { status: 500 }
    );
  }
}
```