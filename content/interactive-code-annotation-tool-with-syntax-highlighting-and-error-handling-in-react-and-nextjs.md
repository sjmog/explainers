# Interactive Code Annotation Tool with Syntax Highlighting and Error Handling in React and Next.js

The following code defines a React component named `NewExamplePage`, which renders a page for code annotation. The component includes a code editor where users can input code, and upon submission, the code is sent to an API and the user is redirected to a new page displaying the annotated code.

```javascript annotate
// Enable client-side rendering in Next.js
"use client";

// Import React and necessary hooks
import React, { useState } from "react";
// Import UI components from Primer React
import { Box, Button, FormControl } from "@primer/react";
// Import useRouter from Next.js for navigation
import { useRouter } from "next/navigation";
// Import code editor component and syntax highlighting libraries
import Editor from "react-simple-code-editor";
import hljs from "highlight.js";
// Import a GitHub-style theme for code highlighting
import "highlight.js/styles/github.css";

// Define and export the React component
export default function NewExamplePage() {
  // Placeholder text displayed in the code editor
  const PLACEHOLDER_CODE = "Copy-paste code here";

  // State variables to manage code input, loading state, and error messages
  const [code, setCode] = useState(PLACEHOLDER_CODE);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Hook for programmatic navigation
  const router = useRouter();

  // Function to highlight code syntax using highlight.js
  function highlightCode(inputCode) {
    return hljs.highlightAuto(inputCode).value;
  }

  // Clear the placeholder text when the editor gains focus
  function handleFocus() {
    if (code === PLACEHOLDER_CODE) {
      setCode("");
    }
  }

  // Update the code state and clear error messages when the code changes
  function handleValueChange(newCode) {
    setCode(newCode);
    setError("");
  }

  // Handle form submission to annotate the code
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Validate that code has been entered and is not just the placeholder
    if (
      !code ||
      code.trim() === "" ||
      code.trim() === PLACEHOLDER_CODE.trim()
    ) {
      setError("Please enter some code.");
      return;
    }

    setIsLoading(true); // Indicate that the annotation process has started
    setError(""); // Clear any previous errors

    try {
      // Send the code to the backend API to create an annotated example
      const res = await fetch("/api/create-example", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();

      // Redirect the user to the page displaying the annotated code
      router.push(`/explainers/${data.id}`);
    } catch (err) {
      // Display an error message if the API request fails
      setError(`Error: ${err}`);
    }
    setIsLoading(false); // Reset the loading state
  };

  // Return the JSX that renders the component's UI
  return (
    <div className="w-full h-screen overflow-y-auto">
      <div className="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <Box p={4} className="w-full">
          <h1 className="h2 text-center">Annotate your code</h1>
          <p className="mb-6 text-center">
            Enter your code below. We'll annotate it.
          </p>
          <form
            onSubmit={handleSubmit}
            className="d-flex flex-column items-center w-full"
          >
            <FormControl className="mb-3 w-full">
              <FormControl.Label visuallyHidden>Code</FormControl.Label>
              <Editor
                value={code}
                className="w-full min-h-[400px] rounded-md mb-4"
                onFocus={handleFocus}
                onBlur={code === "" ? () => setCode(PLACEHOLDER_CODE) : null}
                onValueChange={handleValueChange}
                highlight={highlightCode}
                padding={10}
                style={{
                  backgroundColor: "#f6f8fa",
                  fontFamily: '"Fira code", "Fira Mono", monospace',
                }}
              />
            </FormControl>

            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="bg-indigo-600 font-semibold text-white/95 hover:bg-indigo-700 rounded-md inline-block w-72"
            >
              {isLoading ? "Annotating..." : "Annotate"}
            </Button>
          </form>

          {error && (
            <p className="text-center w-full bg-red-200 py-2 rounded-md shadow-sm font-semibold text-red-800 mt-4 whitespace-pre-wrap">
              Error: {error}
            </p>
          )}
        </Box>
      </div>
    </div>
  );
}
```