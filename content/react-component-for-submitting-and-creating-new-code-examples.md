# React Component for Submitting and Creating New Code Examples

The following code defines a React component that provides a form for users to submit code examples. When submitted, it sends the code to an API endpoint and navigates to a new page to display the created example.

```javascript annotate
// The 'use client' directive marks this component as a client component in Next.js 13.
'use client';

// Import necessary hooks from React and components from libraries.
import { useState } from 'react';
import { Box, Button, FormControl, Textarea } from '@primer/react';
import { useRouter } from 'next/navigation';

// Define the NewExample component.
export default function NewExample() {

  // Initialize the 'code' state and get the router instance.
  const [code, setCode] = useState('');
  const router = useRouter();

  // Function to handle form submission.
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send a POST request to the API with the code data.
      const response = await fetch('/api/create-example', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (response.ok) {
        // On success, navigate to the new example page and refresh.
        const { id } = await response.json();
        router.push(`/explainers/${id}`);
        router.refresh();
      } else {
        // Throw an error if the response is not ok.
        throw new Error('Failed to create example');
      }
    } catch (error) {
      // Log the error and alert the user.
      console.error('Error creating example:', error);
      alert('Failed to create example');
    }
  };

  // Return the form component.
  return (
    <Box p={4}>
      <h1 className="h2 mb-4">Create New Example</h1>
      <form onSubmit={handleSubmit}>
        <FormControl className="mb-3">
          <FormControl.Label>Code</FormControl.Label>
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here..."
            rows={15}
            required
          />
        </FormControl>

        <Button type="submit" variant="primary">
          Create Example
        </Button>
      </form>
    </Box>
  );
}
```