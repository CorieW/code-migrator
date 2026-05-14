---
"template-subscriber-migration-system": patch
---

Allow approve and revise generation to use an external harness command instead of direct OpenAI generation.
Harden generated file application against symlink and `.git` path escapes, and disable Git hooks while committing generated output.
