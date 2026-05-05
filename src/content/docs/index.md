---
title: Template Subscriber Migration System
description: Publish template changes as migrations and let subscriber repositories opt in safely.
---

Template Subscriber Migration System helps one template repository publish migration bundles and many subscriber repositories decide how to apply them.

Use it when repositories start from a shared template, but later drift because each subscriber has local product code, configuration, or style choices.

## Workflow

1. A template PR is merged into the template repository default branch.
2. The template repository publishes a `template-migration/` GitHub Release with `migration-bundle.json`.
3. A subscriber workflow discovers the newest migration release and opens one draft PR.
4. A maintainer comments `/template-sync approve`, `/template-sync revise`, or `/template-sync decline`.
5. The command workflow generates subscriber-specific file operations, validates the result, and updates state.

## Package Commands

The package exposes three binaries:

| Command                        | Runs in               | Purpose                                                 |
| ------------------------------ | --------------------- | ------------------------------------------------------- |
| `publish-template-migration`   | Template repository   | Publishes a migration release for a merged template PR. |
| `subscriber-template-sync`     | Subscriber repository | Opens a draft migration PR for the newest migration.    |
| `handle-template-sync-command` | Subscriber repository | Handles approve, revise, and decline comments.          |

## Start Here

- [Getting started](./getting-started/) shows a full setup.
- [Template setup](./template-setup/) explains publishing migrations.
- [Subscriber setup](./subscriber-setup/) explains discovery and PR creation.
- [Commands](./commands/) lists CLI inputs and environment variables.
