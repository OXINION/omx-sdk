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

## Python Coding Style

### ✅ Always Use Keyword Arguments (Pythonic Standard)

All SDK methods should use **keyword arguments** instead of dictionary-based arguments.

**✅ Recommended (Pythonic):**
```python
fence = await omx.geo_trigger.create(
    name="Downtown Store",
    location={"lat": 40.7128, "lng": -74.006},
    radius=100,
    events=["enter", "exit"]
)
```

**❌ Avoid (JavaScript-style):**
```python
fence = await omx.geo_trigger.create({
    "name": "Downtown Store",
    "location": {"lat": 40.7128, "lng": -74.006},
    "radius": 100,
    "events": ["enter", "exit"]
})
```

**Benefits:**
- ✔ IDE autocomplete support
- ✔ Type hinting and validation
- ✔ Better for both JavaScript and Python developers
- ✔ Follows PEP 8 and Python best practices
