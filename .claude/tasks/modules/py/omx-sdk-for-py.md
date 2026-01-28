## Python SDK Design Rules

- Python SDK provides a **single package only**: `omx-sdk`
- No per-module pip packages
- Internal modules exist, but are not published independently
- Public API must mirror JS SDK behavior
- Naming follows Python conventions (snake_case)
- Initialization uses OmxClient (use the class-based pattern)

```python
 from omx_sdk import OMXClient

  omx = OMXClient(
      client_id="...",
      secret_key="..."
  )
```
