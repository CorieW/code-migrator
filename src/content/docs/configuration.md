---
title: Configuration
description: Environment variables, secrets, and repository variables used by the workflows.
---

## Workflow Environment

| Name                                  | Required             | Used by                 | Description                                                                            |
| ------------------------------------- | -------------------- | ----------------------- | -------------------------------------------------------------------------------------- |
| `TEMPLATE_SYNC_PACKAGE`               | Yes                  | All workflows           | Package spec installed by `npm exec`, such as an npm version, git URL, or tarball URL. |
| `TEMPLATE_SYNC_DEFAULT_UPSTREAM_REPO` | Subscriber workflows | Subscriber repositories | Default upstream template repository in `OWNER/REPO` form.                             |
| `OPENAI_MODEL`                        | Command workflow     | Subscriber repositories | Model used for generation. Defaults to `gpt-4.1` in the workflow example.              |

## Secrets

| Name                                | Required         | Used by              | Description                                                                      |
| ----------------------------------- | ---------------- | -------------------- | -------------------------------------------------------------------------------- |
| `TEMPLATE_SYNC_BOT_TOKEN`           | Yes              | Subscriber workflows | Token for opening PRs, pushing commits, writing comments, labels, and variables. |
| `OPENAI_API_KEY`                    | Yes              | Command workflow     | OpenAI API key for generation.                                                   |
| `TEMPLATE_SYNC_UPSTREAM_READ_TOKEN` | No               | Subscriber workflows | Token for reading private template releases.                                     |
| `NPM_TOKEN`                         | Release workflow | Package repository   | Token used by Changesets to publish to npm.                                      |

## Repository Variables

Subscriber workflows create and update these automatically:

| Name                                       | Description                                    |
| ------------------------------------------ | ---------------------------------------------- |
| `TEMPLATE_SYNC_LAST_HANDLED_MIGRATION_ID`  | Newest migration opened, applied, or declined. |
| `TEMPLATE_SYNC_LAST_APPLIED_MIGRATION_ID`  | Newest migration applied.                      |
| `TEMPLATE_SYNC_LAST_DECLINED_MIGRATION_ID` | Newest migration declined.                     |
| `TEMPLATE_SYNC_UPSTREAM_REPO`              | Optional upstream override for one subscriber. |

## Docs Deployment

Docs are built with Astro Starlight.

Use these optional environment variables if GitHub Pages defaults are not right:

| Name             | Description                                                      |
| ---------------- | ---------------------------------------------------------------- |
| `DOCS_SITE_URL`  | Full canonical site URL, for example `https://docs.example.com`. |
| `DOCS_BASE_PATH` | Base path, for example `/code-migrator/` or `/`.                 |
