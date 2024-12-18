# Handling API Response to Redirect and Refresh Page in a Next.js Application

This code snippet checks if an HTTP response is successful, processes the response data, navigates to a new route based on the data, and handles any errors if the response is not successful.

```javascript annotate
// Check if the HTTP response was successful
if (response.ok) {

  // Extract the 'id' property from the JSON response
  const { id } = await response.json();

  // Navigate to the new page using the extracted 'id'
  router.push(`/explainers/${id}`);

  // Refresh the current route to fetch updated data
  router.refresh();

} else {

  // Throw an error if the response was not successful
  throw new Error('Failed to create example');

}
```