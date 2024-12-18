## Example of an annotated code example

The following examples show what rendered code annotations look like and the raw code that creates them.

### Rendered example

The following code example shows a workflow that posts a welcome comment on a pull request when it is opened.

```yaml annotate
# The name of the workflow as it will appear in the "Actions" tab of the GitHub repository.
name: Post welcome comment
# The `on` keyword lets you define the events that trigger when the workflow is run.
on:
  # Add the `pull_request` event, so that the workflow runs automatically
  # every time a pull request is created.
  pull_request:
    types: [opened]
# Modifies the default permissions granted to `GITHUB_TOKEN`.
permissions:
  pull-requests: write
# Defines a job with the ID `build` that is stored within the `jobs` key.
jobs:
  build:
    name: Post welcome comment
    # Configures the operating system the job runs on.
    runs-on: ubuntu-latest
    # The `run` keyword tells the job to execute a command on the runner.
    steps:
      - run: gh pr comment $PR_URL --body "Welcome to the repository!"
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          PR_URL: ${{ github.event.pull_request.html_url }}
```

### Raw code example

    The following code example shows a workflow that posts a welcome comment on a pull request when it is opened.

    ```yaml annotate
    # The name of the workflow as it will appear in the "Actions" tab of the GitHub repository.
    name: Post welcome comment
    # The `on` keyword lets you define the events that trigger when the workflow is run.
    on:
      # Add the `pull_request` event, so that the workflow runs automatically
      # every time a pull request is created.
      pull_request:
        types: [opened]
    # Modifies the default permissions granted to `GITHUB_TOKEN`.
    permissions:
      pull-requests: write
    # Defines a job with the ID `build` that is stored within the `jobs` key.
    jobs:
      build:
        name: Post welcome comment
        # Configures the operating system the job runs on.
        runs-on: ubuntu-latest
        # The `run` keyword tells the job to execute a command on the runner.
        steps:
          - run: gh pr comment $PR_URL --body "Welcome to the repository!"
            env:
              GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
              PR_URL: ${{ github.event.pull_request.html_url }}
    ```
### Python example

```python annotate
# Import the PyTorch neural network module, which provides base classes and building blocks for neural network architectures.
import torch.nn as nn

# `torch` is needed for tensor operations, such as matmul and tensor reshaping, used later in the code.
import torch

# `F` is used for functional operations like softmax.
import torch.nn.functional as F

# Define a custom encoder layer class that extends `nn.Module`, a PyTorch base class for all neural network modules.
class EncoderLayer(nn.Module):
    # The constructor initializes the encoder layer with model dimensionality (d_model), number of attention heads (num_heads), and feed-forward dimensionality (dim_ff).
    def __init__(self, d_model, num_heads, dim_ff):
        super().__init__()
        
        # Store the number of attention heads.
        self.num_heads = num_heads
        # Store the model's dimension, which is typically the size of the embeddings.
        self.d_model = d_model
        # Compute the dimension per attention head (d_k), typically d_model divided by num_heads.
        self.d_k = d_model // num_heads

        # Define layer normalization layers for both the attention output and the feed-forward output.
        self.attn_ln = nn.LayerNorm(d_model)
        self.ffn_ln = nn.LayerNorm(d_model)
        
        # Define linear transformations for query, key, and value projections, each projecting from d_model to d_model.
        self.W_Q = nn.Linear(d_model, d_model)
        self.W_K = nn.Linear(d_model, d_model)
        self.W_V = nn.Linear(d_model, d_model)
        
        # Define a linear transformation for the output of the multi-head attention mechanism.
        self.W_O = nn.Linear(d_model, d_model)
        
        # Define the feed-forward network (FFN) which typically consists of two linear layers with a nonlinear activation (ReLU) in between.
        self.ffn = nn.Sequential(
            nn.Linear(d_model, dim_ff),
            nn.ReLU(),
            nn.Linear(dim_ff, d_model)
        )

    # The forward method defines the forward pass of the encoder layer. It takes an input tensor `x` and returns the transformed output.
    def forward(self, x):
        # Multi-head attention block:
        
        # Compute the Queries (Q), Keys (K), and Values (V) by passing x through the respective linear layers.
        Q = self.W_Q(x)
        K = self.W_K(x)
        V = self.W_V(x)

        # Reshape and transpose Q, K, V to separate the heads. 
        # After this, Q, K, and V will have shapes: (batch_size, num_heads, seq_len, d_k)
        Q = Q.view(Q.shape[0], Q.shape[1], self.num_heads, self.d_k).transpose(1,2)
        K = K.view(K.shape[0], K.shape[1], self.num_heads, self.d_k).transpose(1,2)
        V = V.view(V.shape[0], V.shape[1], self.num_heads, self.d_k).transpose(1,2)
        
        # Compute attention scores by multiplying Q and the transpose of K, then scale by sqrt(d_k).
        scores = torch.matmul(Q, K.transpose(-2,-1)) / (self.d_k**0.5)
        # Apply the softmax function to convert the scores into attention weights along the last dimension.
        attn_weights = F.softmax(scores, dim=-1)
        # Compute the attention output by multiplying attention weights with V.
        attn_output = torch.matmul(attn_weights, V) # shape: (batch, heads, seq_len, d_k)
        
        # Transpose and reshape the attention output back to (batch_size, seq_len, d_model).
        attn_output = attn_output.transpose(1,2).contiguous().view(x.shape[0], x.shape[1], self.d_model)
        # Apply the output projection to integrate all heads.
        attn_output = self.W_O(attn_output)

        # Add and normalize: residual connection from the input `x` plus attention output, followed by layer normalization.
        x = x + attn_output
        x = self.attn_ln(x)

        # Feed-forward network block:
        
        # Pass the normalized output through the feed-forward network.
        ffn_output = self.ffn(x)
        # Add and normalize: residual connection from the current `x` plus feed-forward output, followed by layer normalization.
        x = x + ffn_output
        x = self.ffn_ln(x)
        
        # Return the transformed output tensor from the encoder layer.
        return x

# Testing the layer:
# Create an instance of the EncoderLayer with specific dimensions.
layer = EncoderLayer(d_model=8, num_heads=2, dim_ff=32)

# Assume we have some input tensor `x` with shape (batch_size, seq_len, d_model).
# For demonstration, we'll create a random tensor here. In practice, this would be your input embeddings.
batch_size = 2
seq_len = 5
d_model = 8
x = torch.randn(batch_size, seq_len, d_model)

# Pass `x` through the encoder layer.
out = layer(x)
# Print the shape of the output to verify that it matches the input shape (except for transformations done inside).
print("Output shape after encoder layer:", out.shape)
```