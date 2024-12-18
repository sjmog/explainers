import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import yaml from "js-yaml";

export async function POST(request) {
  try {
    const { code } = await request.json();

    // Generate a descriptive title from the code
    const titleResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o", // or your desired model
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
    const titleData = await titleResponse.json();
    let title = titleData.choices?.[0]?.message?.content || "untitled";

    // Make the title url-friendly
    const sanitizedTitle = title
      .normalize("NFD") // split accented characters into their parts
      .replace(/[\u0300-\u036f]/g, "") // remove accent/focus marks
      .replace(/[^\w\s-]/g, "") // remove all non-word characters except spaces/hyphens
      .trim()
      .replace(/\s+/g, "-") // replace spaces with hyphens
      .toLowerCase();

    // Convert sanitized title to kebab-case filename
    const filename = sanitizedTitle || "untitled";

    const ANNOTATION_FRAMEWORK = await fs.readFile(
      path.join(process.cwd(), "data", `ANNOTATION_FRAMEWORK.md`),
      "utf8"
    );

    const codeLanguagesFileContents = await fs.readFile(
      path.join(process.cwd(), "data", "code-languages.yml"),
      "utf8"
    );
    const codeLanguages = yaml.load(codeLanguagesFileContents);

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
            content: `Explain and annotate this code using the Github Docs Code Annotation framework. ANNOTATION_FRAMEWORK: ${ANNOTATION_FRAMEWORK} When marking code blocks, you may use only the following languages: ${Object.keys(
              codeLanguages
            ).join(", ")} CODE: ${code}`,
          },
        ],
      }),
    });
    const data = await response.json();
    console.log(data);

    // Write the O1 transformation (or fallback to original code on error)
    const transformedCode = data.choices?.[0]?.message?.content || code;

    // Create markdown content with the transformed code
    const markdownContent = `# ${title}\n\n${transformedCode}`;

    // Make an ID out of the filename plus a big string of random characters after to avoid collisions
    const id = `${filename}-${Math.random().toString(36).substring(2, 15)}`;

    // Write to file
    const filePath = path.join(process.cwd(), "content", `${id}.md`);
    await fs.writeFile(filePath, markdownContent);

    return NextResponse.json({ id });
  } catch (error) {
    console.error("Error creating example:", error);
    return NextResponse.json(
      { error: "Failed to create example" },
      { status: 500 }
    );
  }
}
