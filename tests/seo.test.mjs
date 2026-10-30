import assert from "node:assert/strict";
import { test } from "node:test";
import { readFile } from "node:fs/promises";
import { PUBLIC_PAGES, pageMetadata, structuredData } from "../src/seo/pageMetadata.js";

test("public pages have distinct, indexable titles and canonical URLs", () => {
  assert.equal(new Set(Object.values(PUBLIC_PAGES).map((page) => page.title)).size, 3);
  for (const path of Object.keys(PUBLIC_PAGES)) {
    assert.match(pageMetadata(path).robots, /^index,/);
    assert.equal(new URL(pageMetadata(path).canonical).host, "ahiia.ai");
  }
  assert.equal(pageMetadata("/about/").canonical, "https://ahiia.ai/about");
});

test("private, sign-in and unknown routes are excluded from indexing", () => {
  for (const path of ["/dashboard", "/dashboard/documents/123", "/admin", "/login", "/signup", "/otp", "/reset-password/token", "/unknown"]) {
    assert.equal(pageMetadata(path).robots, "noindex, follow");
    assert.equal(pageMetadata(path).canonical, null);
  }
});

test("structured data describes the actual company and website", () => {
  const data = structuredData();
  assert.equal(data["@graph"][0].url, "https://ahiia.ai/");
  assert.equal(data["@graph"][1]["@type"], "WebSite");
  assert.doesNotMatch(JSON.stringify(data), /rating|reviewCount|api\.ahiia\.ai/);
});

test("production build serves readable HTML with the correct public-page metadata", async () => {
  for (const path of Object.keys(PUBLIC_PAGES)) {
    const html = await readFile(new URL(path === "/" ? "../dist/index.html" : `../dist${path}.html`, import.meta.url), "utf8");
    assert.match(html, /<h1/);
    assert.ok(html.includes(pageMetadata(path).title.replaceAll("&", "&amp;")));
    assert.ok(html.includes(`href="${pageMetadata(path).canonical}"`));
    assert.match(html, /application\/ld\+json/);
    assert.doesNotMatch(html, /noindex/);
  }
});

test("workspace routes use a noindex application shell without marketing content", async () => {
  const html = await readFile(new URL("../dist/app.html", import.meta.url), "utf8");
  assert.match(html, /content="noindex, follow"/);
  assert.ok(html.includes('<div id="root"></div>'));
  assert.doesNotMatch(html, /rel="canonical"|<h1/);
});
