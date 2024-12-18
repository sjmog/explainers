import fs from "fs";
import path from "path";
import { Box, Button } from '@primer/react'
import Link from 'next/link';

export default async function Home() {
  const contentPath = path.join(process.cwd(), "content");
  const files = fs.readdirSync(contentPath);
  
  const examples = files
    .filter(file => file.endsWith('.md'))
    .map(file => ({
      id: file.replace('.md', ''),
      name: file.replace('.md', '').split('-').join(' ') // Convert kebab-case to spaces
    }));

  return (
    <div className="d-lg-flex">
      <div className="flex-column flex-1 min-width-0">
        <main id="main-content" style={{ scrollMarginTop: "5rem" }}>
          <Box p={4}>
            <div className="d-flex flex-items-center mb-4">
              <h1 className="flex-auto">Code Examples</h1>
              <Link href="/new-example" className="no-underline">
                <Button variant="primary">
                  New Example
                </Button>
              </Link>
            </div>
            <ul className="list-style-none">
              {examples.map((example) => (
                <li key={example.id} className="mb-3">
                  <Link 
                    href={`/explainers/${example.id}`}
                    className="Link--primary no-underline"
                  >
                    <h3 className="h4">{example.name}</h3>
                  </Link>
                </li>
              ))}
            </ul>
          </Box>
        </main>
      </div>
    </div>
  );
}
