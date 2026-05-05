---
title: Operations
description: Release, validation, and documentation workflows for maintainers.
---

## Local Checks

Run the same checks as CI:

```sh
npm run format:check
npm run lint
npm test
npm run knip
```

Build docs locally:

```sh
npm run docs:build
```

Preview docs:

```sh
npm run docs:preview
```

## CI

The CI workflow runs on pull requests and pushes to `main`.

It checks:

- Prettier formatting,
- syntax and ESLint,
- Node tests,
- Knip unused-file and dependency analysis.

## Release

The release workflow uses Changesets.

Add a changeset before merging a package change:

```sh
npm run changeset
```

On `main`, Changesets creates a release PR or publishes when the release PR is merged. Publishing requires `NPM_TOKEN`.

## Documentation Deploys

Docs deploy to GitHub Pages from `.github/workflows/deploy-docs.yml`.

The release workflow also has a manual `deploy_docs` input. Select it when you want to publish docs during the same release workflow run.
