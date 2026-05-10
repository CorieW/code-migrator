import test from "node:test";
import assert from "node:assert/strict";
import { renderCommandFailureComment, renderMigrationPrBody } from "../src/template-sync/render.js";

test("renders generated migration summary in subscriber PR body", () => {
  const body = renderMigrationPrBody({
    migration: { id: "template-migration/pr-1-abcdef" },
    sourceSummary: "PR source summary",
    generatedSummary: "Reusable template summary.",
    sourcePullRequest: {
      url: "https://github.com/acme/template/pull/1",
      mergedInto: "main",
      mergedAt: "2026-05-01T00:00:00Z",
      mergedSha: "abcdef",
    },
    changedFiles: [],
  });

  assert.match(body, /Template Change Summary/);
  assert.match(body, /Reusable template summary/);
});

test("renders command failure comments for configuration errors", () => {
  const body = renderCommandFailureComment({
    action: "approve",
    errorMessage: "Missing required environment variable: OPENAI_API_KEY",
  });

  assert.match(body, /Template migration command failed/);
  assert.match(body, /`\/template-sync approve` command could not complete/);
  assert.match(body, /Missing required environment variable: OPENAI_API_KEY/);
  assert.match(body, /comment `\/template-sync approve` again/);
});

test("escapes code fences in command failure comments", () => {
  const body = renderCommandFailureComment({
    action: "revise",
    errorMessage: "bad ``` fence",
  });

  assert.doesNotMatch(body, /bad ``` fence/);
  assert.match(body, /bad ` ` ` fence/);
});
