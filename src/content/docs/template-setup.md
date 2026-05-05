---
title: Template Setup
description: Publish migration bundles from the upstream template repository.
---

## Workflow

Use `.github/workflows/template-publish-migration.yml` in the template repository.

Required workflow environment:

```yaml
env:
  TEMPLATE_SYNC_PACKAGE: template-subscriber-migration-system@0.1.0
```

Required permissions:

```yaml
permissions:
  contents: write
  pull-requests: read
```

## Publish a Migration

Run the workflow manually after merging a template PR into the template repository default branch.

Example input:

```yaml
pr_number: 123
```

The command validates that the PR:

- belongs to the current template repository,
- targets the repository default branch,
- is merged,
- has a merge commit SHA.

It then creates a release and uploads `migration-bundle.json`.

## Bundle Contents

Each migration bundle includes:

- template repository name and branch,
- source PR title, body, labels, URL, merge SHA, and merge time,
- normalized changed file list,
- unified PR patch.

Subscriber repositories use the bundle as context for downstream generation.
