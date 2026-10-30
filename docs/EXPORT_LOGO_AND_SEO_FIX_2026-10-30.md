# Company logos in exports and public-site indexing

When a logo was uploaded, the editor could show a locally held image even though it was not saved to the company profile. The export generators also drew initials without embedding the selected logo. The previous logo preloader was unused. This is an application issue; the available evidence does not establish a MacBook hardware fault.

## Export behavior

- PDF, DOCX and PPTX now embed the selected logo as PNG with its aspect ratio preserved.
- SVG and other browser-decodable image formats are rasterized before packaging, avoiding Office format differences and cross-origin DOM canvas reuse.
- If a selected logo cannot be loaded, export reports an error instead of silently downloading a file without the logo.
- The download URL remains valid for 30 seconds after the click, so WebKit has time to read it.
- Logo uploads require successful cloud storage. A browser-only data URL is no longer reported as a cross-device upload.
- Brand Kit and workspace uploads save the logo to the company profile, which is the backend's authoritative logo record. A fresh profile fetch confirms persistence before success is reported.
- Company Profile uploads also check the saved response before changing the active logo.
- The backend business-context update must accept `logoUrl` and preserve omitted context fields. Deploy that compatibility fix before this frontend release.

Validation: the production build succeeds. Regression tests generate 36 combinations across six document types, three styles and PDF/native formats; they inspect embedded PDF image objects and the actual PNG bytes inside DOCX/PPTX packages. Browser checks also download PDF, DOCX and PPTX after converting a newly loaded SVG. All 18 PDF cover variants were rendered for visual review. Actual macOS Safari testing is still a device-specific follow-up; the local browser is Chromium on Windows.

## SEO behavior

- The homepage, About and Contact pages are pre-rendered to readable HTML with distinct titles, descriptions and canonical URLs.
- Organization and website structured data describe the real company without invented ratings or reviews.
- About and Contact now have useful content and are linked from the footer.
- The company site remains indexable. Workspace and authentication routes use a separate noindex application shell and route-specific response headers.
- `www.ahiia.ai` redirects permanently to the canonical `ahiia.ai` hostname. The sitemap continues to list the three public pages.
- Heavy export libraries load when exporting, reducing the initial JavaScript payload from about 594 kB to 208 kB compressed in the measured build.
- The prepared Google verification file supports verifying the frontend property under the company account. Ownership verification, sitemap submission and homepage indexing requests require completing Search Console setup after publication.

Google's API-only removal does not include `ahiia.ai`. The connected Search Console account initially listed only the API property. Search engines decide when to crawl and index the public pages; no deployment can guarantee immediate appearance or a particular ranking.

Run `npm ci`, `npm run build` and `npm test`. Generated test exports are in the ignored `test-output/exports` directory.
