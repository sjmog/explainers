# Markdown Content Renderer with Error Handling and Static Params Generation for Next.js Pages

import fs from "fs";
import path from "path";
import cx from "classnames";
import articleStyles from "@/components/ArticleInlineLayout.module.scss";
import { MarkdownContent } from "@/components/MarkdownContent";
import { renderUnified } from "@/lib/renderUnified";
import { Box } from "@primer/react";
import { notFound } from "next/navigation";

export default async function ExplainerPage({ params }) {
  const { id } = await params;

  try {
    const filePath = path.join(process.cwd(), "content", `${id}.md`);
    const content = fs.readFileSync(filePath, "utf8");
    const markdownContent = await renderUnified(content);

    return (
      <div className="d-lg-flex">
        <div className="flex-column flex-1 min-width-0">
          <main id="main-content" style={{ scrollMarginTop: "5rem" }}>
            <Box
              data-container="article"
              gridArea="content"
              data-search="article-body"
              className={cx(articleStyles.containerBox)}
            >
              <MarkdownContent>{markdownContent}</MarkdownContent>
            </Box>
          </main>
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}

// Generate static params for all existing examples
export async function generateStaticParams() {
  const contentPath = path.join(process.cwd(), "content");
  const files = fs.readdirSync(contentPath);

  return files
    .filter((file) => file.endsWith(".md"))
    .map((file) => ({
      id: file.replace(".md", ""),
    }));
}
