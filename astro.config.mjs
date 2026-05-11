import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

function defaultDocsBase() {
  const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] || "";
  if (!process.env.GITHUB_ACTIONS || !repositoryName || repositoryName.endsWith(".github.io")) {
    return "/";
  }
  return `/${repositoryName}/`;
}

function defaultDocsSite() {
  if (process.env.DOCS_SITE_URL) {
    return process.env.DOCS_SITE_URL;
  }
  const owner = process.env.GITHUB_REPOSITORY_OWNER;
  return owner ? `https://${owner}.github.io` : "http://localhost:4321";
}

const defaultDocsThemeScript = `
try {
  if (localStorage.getItem("starlight-theme") === null) {
    localStorage.setItem("starlight-theme", "dark");
  }
} catch {}
`;

export default defineConfig({
  site: defaultDocsSite(),
  base: process.env.DOCS_BASE_PATH || defaultDocsBase(),
  integrations: [
    starlight({
      title: "Template Subscriber Migration System",
      customCss: ["/src/styles/github-dark.css"],
      head: [{ tag: "script", content: defaultDocsThemeScript }],
      expressiveCode: {
        themes: ["github-dark-default", "github-light-default"],
        useStarlightUiThemeColors: true,
      },
      sidebar: [
        {
          label: "Guide",
          items: [
            { slug: "getting-started" },
            { slug: "template-setup" },
            { slug: "subscriber-setup" },
            { slug: "approve-revise-decline" },
          ],
        },
        {
          label: "Reference",
          items: [{ slug: "configuration" }, { slug: "commands" }],
        },
      ],
    }),
  ],
});
