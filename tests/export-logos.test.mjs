import assert from "node:assert/strict";
import { test, mock } from "node:test";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import JSZip from "jszip";
import { fitImage, loadExportLogo, triggerBlobDownload } from "../src/services/exportAssets.js";
import { exportToPdf, exportToDocx, exportToPptx } from "../src/services/documentExportEngine.js";

const png = await readFile(new URL("./fixtures/company-logo.png", import.meta.url));
const logoUrl = "data:image/png;base64," + png.toString("base64");

test("logo aspect ratio is preserved in square and wide bounds", () => {
  assert.deepEqual(fitImage(320, 160, 80, 80), { width: 80, height: 40 });
  assert.deepEqual(fitImage(160, 320, 80, 80), { width: 40, height: 80 });
  assert.throws(() => fitImage(0, 0, 80, 80));
});

test("PNG bytes are loaded without browser storage or canvas", async () => {
  const logo = await loadExportLogo(logoUrl);
  assert.deepEqual(Buffer.from(logo.bytes), png);
  assert.equal(logo.width, 320);
  assert.equal(logo.height, 160);
  assert.equal(await loadExportLogo(""), null);
  await assert.rejects(loadExportLogo("data:image/png;base64,AA=="));
});

test("a failed logo request fails the export instead of silently dropping the logo", async () => {
  const fetchMock = mock.method(globalThis, "fetch", async () => { throw new Error("CORS blocked"); });
  try { await assert.rejects(loadExportLogo("https://res.cloudinary.com/example/image/upload/logo.png"), /logo could not be loaded/i); }
  finally { fetchMock.mock.restore(); }
});

test("downloads keep their blob URL alive after click for WebKit", () => {
  let cleanup, clicked = false, removed = false, revoked = false;
  const previousDocument = globalThis.document;
  const urlMock = mock.method(URL, "createObjectURL", () => "blob:fixture");
  const revokeMock = mock.method(URL, "revokeObjectURL", () => { revoked = true; });
  const timerMock = mock.method(globalThis, "setTimeout", (callback, delay) => { assert.equal(delay, 30000); cleanup = callback; });
  globalThis.document = { createElement: () => ({ click() { clicked = true; }, remove() { removed = true; } }), body: { appendChild() {} } };
  try {
    triggerBlobDownload(new Blob(["fixture"]), "fixture.pdf");
    assert.ok(clicked);
    assert.equal(revoked, false);
    assert.equal(removed, false);
    cleanup();
    assert.ok(revoked && removed);
  } finally { timerMock.mock.restore(); revokeMock.mock.restore(); urlMock.mock.restore(); globalThis.document = previousDocument; }
});

test("every document/style exports an embedded logo in PDF and its native format", async (t) => {
  const previousDocument = globalThis.document;
  const originalTimeout = globalThis.setTimeout;
  const timerMock = mock.method(globalThis, "setTimeout", (callback, delay, ...args) => originalTimeout(callback, delay === 30000 ? 0 : delay, ...args));
  globalThis.document = { createElement: (tag) => { assert.equal(tag, "a"); return { click() {}, remove() {} }; }, body: { appendChild() {} } };
  const output = new URL("../test-output/exports/", import.meta.url);
  await mkdir(output, { recursive: true });
  const evidence = [];
  try {
    for (const type of ["Business Proposal", "Business Plan", "SOP", "Contract", "Marketing Plan", "Pitch Deck"]) {
      for (const styleTemplate of ["Corporate", "Minimal", "Creative"]) {
        for (const format of ["pdf", type === "Pitch Deck" ? "pptx" : "docx"]) {
          await t.test(`${type} / ${styleTemplate} / ${format}`, async () => {
            const payload = {
              documentTitle: `Logo QA ${type}`, documentType: type, styleTemplate,
              brandKit: { primaryColor: "#151B4D", secondaryColor: "#2F60FF", logoUrl, tagline: "Verified company branding" },
              companyProfile: { companyName: "Logo QA Company", preparedFor: "Export Verification Team" },
              sections: [
                { title: "Executive Summary", paragraphs: ["This fixture verifies the company logo is embedded in the exported document, rather than linked to the browser cache."] },
                { title: "Delivery Plan", paragraphs: ["The team will review the document, confirm its branding and share the final approved version."], bullets: ["Preserve the uploaded logo", "Retain the document content"] },
              ],
            };
            const blob = await ({ pdf: exportToPdf, docx: exportToDocx, pptx: exportToPptx })[format](payload);
            const bytes = Buffer.from(await blob.arrayBuffer());
            assert.ok(bytes.length > 1000);
            if (format === "pdf") {
              assert.ok(bytes.includes(Buffer.from("/Subtype /Image")), "PDF must contain an image object");
              assert.ok(bytes.includes(Buffer.from("/Width 320")), "PDF must embed the actual logo dimensions");
            } else {
              const zip = await JSZip.loadAsync(bytes);
              const media = Object.values(zip.files).filter((entry) => !entry.dir && /(?:word|ppt)\/media\/.*\.png$/i.test(entry.name));
              assert.ok(media.length > 0, "Office file must contain an embedded PNG image part");
              assert.ok((await Promise.all(media.map((entry) => entry.async("nodebuffer")))).some((image) => image.equals(png)), "Embedded image must be the selected company logo");
            }
            const filename = `${type.toLowerCase().replaceAll(" ", "-")}-${styleTemplate}.${format}`;
            await writeFile(new URL(filename, output), bytes);
            evidence.push({ documentType: type, styleTemplate, format, size: bytes.length, logoEmbedded: true, file: filename });
          });
        }
      }
    }
    await writeFile(new URL("evidence.json", output), JSON.stringify(evidence, null, 2));
  } finally { timerMock.mock.restore(); globalThis.document = previousDocument; }
});
