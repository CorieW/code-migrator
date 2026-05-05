# Template Subscriber Migration System

GitHub Actions helpers for publishing template changes as migration bundles and letting subscriber repositories opt into subscriber-specific migration PRs.

Use this when one repository acts as an upstream template and many downstream repositories need a controlled way to receive template changes after they have drifted.

## Documentation

The docs are the source of truth for setup, configuration, and operations:

- [Getting started](src/content/docs/getting-started.md)
- [Template setup](src/content/docs/template-setup.md)
- [Subscriber setup](src/content/docs/subscriber-setup.md)
- [Approve, revise, decline](src/content/docs/approve-revise-decline.md)
- [Configuration](src/content/docs/configuration.md)
- [Commands](src/content/docs/commands.md)
- [Operations](src/content/docs/operations.md)

## What Ships

This package provides three binaries:

| Command                        | Purpose                                                                                 |
| ------------------------------ | --------------------------------------------------------------------------------------- |
| `publish-template-migration`   | Publish a GitHub Release migration bundle for a merged template PR.                     |
| `subscriber-template-sync`     | Discover the newest template migration and open a draft subscriber PR.                  |
| `handle-template-sync-command` | Handle `/template-sync approve`, `/template-sync revise`, and `/template-sync decline`. |

It also includes example GitHub Actions workflows for template publishing, subscriber discovery, and migration commands.

## Install

Use a pinned package spec in workflows:

```yaml
env:
  TEMPLATE_SYNC_PACKAGE: template-subscriber-migration-system@0.1.0
```

Run a binary directly:

```sh
npm exec --yes --package template-subscriber-migration-system@0.1.0 -- subscriber-template-sync
```

Or install locally:

```sh
npm install --save-dev template-subscriber-migration-system
```

## Development

Requires Node.js 20 or newer.

```sh
npm test
npm run lint
npm run docs:dev
npm run pack:check
```
