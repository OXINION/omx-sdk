# Publishing Guide for OMX SDK

This guide covers how to publish the OMX SDK to both npm and PyPI.

## Prerequisites

### For npm

1. Create an npm account at [npmjs.com](https://npmjs.com)
2. Login to npm CLI: `npm login`
3. Verify access: `npm whoami`

### For PyPI

1. Create an account at [pypi.org](https://pypi.org)
2. Generate an API token at https://pypi.org/manage/account/token/
3. Configure credentials (see methods below)

### For GitHub Actions (Automated)

1. Set up repository secrets:
   - `NPM_TOKEN`: Your npm authentication token
   - `PYPI_TOKEN`: Your PyPI API token

## Manual Publishing

### Publishing to npm

1. **Navigate to the JavaScript package:**

   ```bash
   cd omx-sdk/js
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Build the packages:**

   ```bash
   pnpm build
   ```

4. **Publish using the script:**

   ```bash
   ../scripts/publish-npm.sh
   ```

   Or manually:

   ```bash
   cd packages/meta/omx-sdk
   npm publish --tag latest
   ```

### Publishing to PyPI

1. **Navigate to the Python package:**

   ```bash
   cd omx-sdk/py
   ```

2. **Install build dependencies:**

   ```bash
   pip install build twine
   ```

3. **Build the package:**

   ```bash
   python -m build
   ```

4. **Publish using the script:**

   ```bash
   ../scripts/publish-pypi.sh
   ```

   Or manually:

   ```bash
   # Check the package first
   python -m twine check dist/*

   # Upload to PyPI
   python -m twine upload dist/*
   ```

## Automated Publishing with GitHub Actions

The repository includes a GitHub Actions workflow that automatically publishes to both npm and PyPI when you create a new release tag.

### Creating a Release

1. **Update version numbers:**
   - JavaScript: `omx-sdk/js/packages/meta/omx-sdk/package.json`
   - Python: `omx-sdk/py/pyproject.toml`

2. **Create and push a git tag:**

   ```bash
   git tag v1.0.5
   git push origin v1.0.5
   ```

3. **The GitHub Action will automatically:**
   - Build both packages
   - Run tests
   - Publish to npm
   - Publish to PyPI

### Manual Trigger

You can also manually trigger the publishing workflow from the GitHub Actions tab.

## Version Management

### JavaScript Package (npm)

- Package name: `omx-sdk`
- Current version: `1.0.5`
- Location: `omx-sdk/js/packages/meta/omx-sdk/package.json`

### Python Package (PyPI)

- Package name: `omx-sdk`
- Current version: `0.2.0`
- Location: `omx-sdk/py/pyproject.toml`

### Updating Versions

Before publishing, make sure to update the version numbers in both packages:

1. **JavaScript:**

   ```json
   {
     "name": "omx-sdk",
     "version": "1.0.5"
   }
   ```

2. **Python:**
   ```toml
   [project]
   name = "omx-sdk"
   version = "0.2.1"
   ```

## Package Structure

### npm Package

- **Main entry:** `./dist/index.js`
- **TypeScript types:** `./dist/index.d.ts`
- **Exports:** Multiple entry points for core, geotrigger, email, webhook, notification, beacon, campaign, and shared modules

### PyPI Package

- **Module name:** `omx_sdk`
- **Source location:** `src/omx_sdk/`
- **Dependencies:** `httpx>=0.25.0`

## Troubleshooting

### npm Issues

- **401 Unauthorized:** Run `npm login` and verify with `npm whoami`
- **403 Forbidden:** Check if package name is available or if you have publish rights
- **Build errors:** Ensure all dependencies are installed with `pnpm install`

### PyPI Issues

- **403 Forbidden:** Verify your API token and account permissions
- **400 Bad Request:** Check that the version number hasn't been used before
- **Build errors:** Ensure build dependencies are installed: `pip install build twine`

### GitHub Actions Issues

- **Missing secrets:** Verify `NPM_TOKEN` and `PYPI_TOKEN` are set in repository secrets
- **Build failures:** Check the Actions tab for detailed error logs

## Post-Publishing Verification

### npm

```bash
npm info omx-sdk
npm install omx-sdk
```

### PyPI

```bash
pip show omx-sdk
pip install omx-sdk
```

## Support

For issues with publishing or the packages themselves, please:

1. Check the troubleshooting section above
2. Open an issue at https://github.com/oxinion/omx-sdk/issues
3. Contact support@oxinion.com
