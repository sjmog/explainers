import { MarkdownContent } from "@/components/MarkdownContent";
import fs from "fs";
import path from "path";
import cx from "classnames";
import { renderUnified } from "@/lib/renderUnified";
import { Box } from '@primer/react'
import articleStyles from "@/components/ArticleInlineLayout.module.scss";

export default async function Home() {
  // Read the markdown file content
  const markdownContent = await renderUnified(
    fs.readFileSync(path.join(process.cwd(), "content/example.md"), "utf8")
  );

  return (
    <div className="d-lg-flex">
      <div className="flex-column flex-1 min-width-0">
        <main id="main-content" style={{ scrollMarginTop: "5rem" }}>
          <div className={cx(articleStyles.containerBox)}>
            <Box
              data-container="article"
              gridArea="content"
              data-search="article-body"
              className={cx(articleStyles.articleContainer)}
            >
              <MarkdownContent>{markdownContent}</MarkdownContent>
            </Box>
          </div>
        </main>
      </div>
    </div>
  );
}
