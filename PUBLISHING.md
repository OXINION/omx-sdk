# Publishing Guide

This guide explains how to publish the OMX SDK packages to npm.

## Prerequisites

1. **npm account**: Make sure you have an npm account with access to publish `@omx-sdk/*` packages
2. **npm authentication**: Login to npm in your terminal: `npm login`
3. **GitHub secrets**: Set up the following secrets in your GitHub repository:
   - `NPM_TOKEN`: Your npm authentication token

## Publishing Process

### Automated Publishing (Recommended)

The project uses Changesets for automated versioning and publishing:

1. **Create a changeset** for your changes:

   ```bash
   pnpm changeset
   ```

2. **Follow the prompts** to describe your changes and select which packages should be updated

3. **Commit and push** your changes including the changeset files:

   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin main
   ```

4. **GitHub Actions will automatically**:
   - Create a "Version Packages" PR with version bumps
   - When you merge that PR, it will publish all packages to npm

### Manual Publishing

If you need to publish manually:

1. **Build all packages**:

   ```bash
   pnpm build
   ```

2. **Version packages** (if not using changesets):

   ```bash
   pnpm version-packages
   ```

3. **Publish to npm**:
   ```bash
   pnpm publish-packages
   ```

## Package Structure

The SDK consists of the following publishable packages:

- `omx-sdk` - Main unified SDK package
- `@omx-sdk/core` - Core authentication and utilities module
- `@omx-sdk/email` - Email functionality
- `@omx-sdk/geotrigger` - Geolocation triggers
- `@omx-sdk/webhook` - Webhook handling
- `@omx-sdk/beacon` - Beacon integration
- `@omx-sdk/push-notification` - Push notifications

## Version Management

- All packages use semantic versioning (semver)
- Workspace dependencies use `workspace:*` notation during development
- Changesets automatically converts them to proper version ranges during publishing
- The main `omx-sdk` package depends on all sub-packages

## Publishing Checklist

Before publishing:

- [ ] All tests pass: `pnpm test`
- [ ] Code lints successfully: `pnpm lint`
- [ ] All packages build successfully: `pnpm build`
- [ ] Documentation is up to date
- [ ] CHANGELOG is updated (automatically done by changesets)
- [ ] Version numbers are correct

## Troubleshooting

### Publishing Failures

If publishing fails, check:

1. **npm authentication**: Run `npm whoami` to verify you're logged in
2. **Package permissions**: Ensure you have publish access to `@omx-sdk/*` scope
3. **Version conflicts**: Check if the version already exists on npm
4. **Build issues**: Ensure all packages build successfully

### Common Issues

- **"Package already exists"**: Version already published, bump version
- **"Unauthorized"**: Check npm authentication and package permissions
- **"Build failures"**: Fix TypeScript compilation errors before publishing

## First-time Setup

If this is the first time publishing these packages:

1. **Create npm organization** (if not exists): `@omx-sdk`
2. **Grant team access** to the organization
3. **Verify scoped package settings** in npm
4. **Test with a pre-release version** first
