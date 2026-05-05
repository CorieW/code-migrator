---
title: Getting Started
description: Install the package, configure workflows, and run one migration.
---

## 1. Pick a Package Spec

Each workflow runs package binaries through `npm exec`. Set `TEMPLATE_SYNC_PACKAGE` to something GitHub Actions can install.

Examples:

```yaml
env:
  TEMPLATE_SYNC_PACKAGE: template-subscriber-migration-system@0.1.0
```

```yaml
env:
  TEMPLATE_SYNC_PACKAGE: github:OWNER/template-subscriber-migration-system#v0.1.0
```

Do not use `@latest` for production subscribers. Pin an exact version or immutable tag so old repositories do not change behavior unexpectedly.

## 2. Configure the Template Repository

Copy `.github/workflows/template-publish-migration.yml` into the template repository and set `TEMPLATE_SYNC_PACKAGE`.

After a template PR merges, run the workflow manually with the merged PR number:

```text
pr_number: 123
```

The workflow creates a GitHub Release tagged like:

```text
template-migration/pr-123-abc1234
```

## 3. Configure Subscriber Repositories

Copy these workflows into every subscriber:

- `.github/workflows/template-sync.yml`
- `.github/workflows/template-migration-command.yml`

Set the upstream template repository:

```yaml
env:
  TEMPLATE_SYNC_DEFAULT_UPSTREAM_REPO: octo-org/template-repo
```

Set required secrets:

| Secret                              | Purpose                                                               |
| ----------------------------------- | --------------------------------------------------------------------- |
| `TEMPLATE_SYNC_BOT_TOKEN`           | Opens PRs, pushes commits, comments, and writes repository variables. |
| `OPENAI_API_KEY`                    | Generates subscriber-specific migration file operations.              |
| `TEMPLATE_SYNC_UPSTREAM_READ_TOKEN` | Optional token for private upstream release reads.                    |

## 4. Apply a Migration

When `template-sync.yml` runs, it opens a draft PR. A maintainer comments:

```text
/template-sync approve
```

With guidance:

```text
/template-sync approve
Keep the subscriber theme and preserve the existing analytics adapter.
```

If validation fails, the workflow comments with the failed commands and does not mark the migration applied.
