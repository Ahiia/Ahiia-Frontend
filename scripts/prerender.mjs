import { readFile, writeFile } from "node:fs/promises";
import { render } from "../.ssr-build/prerender.js";
import { PUBLIC_PAGES, pageMetadata, structuredData } from "../src/seo/pageMetadata.js";

const template = await readFile("dist/index.html", "utf8");
const escape = (value) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
// Authentication and workspace routes use an empty application shell, rather
// than briefly showing the pre-rendered marketing homepage before React loads.
const appShell = template.replace(/<title>[\s\S]*?<\/title>/i, "<title>Ahiia.ai Workspace</title>")
  .replace(/<meta\s+name="robots"[\s\S]*?\/>/i, '<meta name="robots" content="noindex, follow" />')
  .replace(/<link rel="canonical"[^>]*\/>/i, "");
await writeFile("dist/app.html", appShell);
for (const path of Object.keys(PUBLIC_PAGES)) {
  const page = pageMetadata(path);
  let html = template.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escape(page.title)}</title>`);
  for (const [key, value] of Object.entries({ description: page.description, robots: page.robots,
    "og:title": page.title, "og:description": page.description, "og:url": page.canonical,
    "twitter:title": page.title, "twitter:description": page.description })) {
    const attribute = key.startsWith("og:") ? "property" : "name";
    html = html.replace(new RegExp(`<meta\\s+${attribute}="${key}"[\\s\\S]*?\\/>`, "i"), `<meta ${attribute}="${key}" content="${escape(value)}" />`);
  }
  html = html.replace(/<link rel="canonical"[^>]*\/>/, `<link rel="canonical" href="${page.canonical}" />`)
    .replace('<div id="root"></div>', `<div id="root">${render(path)}</div>`)
    .replace("</head>", `<script type="application/ld+json">${JSON.stringify(structuredData()).replaceAll("<", "\\u003c")}</script><noscript><style>.opacity-0{opacity:1!important;transform:none!important}</style></noscript></head>`);
  if (!html.includes("<h1") || !html.includes(page.canonical)) throw new Error(`Invalid prerendered public page: ${path}`);
  await writeFile(path === "/" ? "dist/index.html" : `dist${path}.html`, html);
}
console.log("Prerendered homepage, about and contact pages with route-specific metadata.");
