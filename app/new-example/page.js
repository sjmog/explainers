"use client";

import React, { useState } from "react";
import { Box, Button, FormControl } from "@primer/react";
import { useRouter } from "next/navigation";
import Editor from "react-simple-code-editor";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";

export default function NewExamplePage() {
  const PLACEHOLDER_CODE = "Copy-paste code here";
  const [code, setCode] = useState(PLACEHOLDER_CODE);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  function highlightCode(inputCode) {
    return hljs.highlightAuto(inputCode).value;
  }

  function handleFocus() {
    if (code === PLACEHOLDER_CODE) {
      setCode("");
    }
  }

  function handleValueChange(newCode) {
    setCode(newCode);
    setError("");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !code ||
      code.trim() === "" ||
      code.trim() === PLACEHOLDER_CODE.trim()
    ) {
      setError("Please enter some code.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/create-example", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      router.push(`/explainers/${data.id}`);
    } catch (err) {
      setError(`Error: ${err}`);
    }
    setIsLoading(false);
  };

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
