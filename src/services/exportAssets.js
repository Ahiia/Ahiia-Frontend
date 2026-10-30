const PNG_PREFIX = "data:image/png;base64,";

export function fitImage(width, height, boxWidth, boxHeight) {
  if (!(width > 0 && height > 0)) throw new Error("The company logo has invalid dimensions.");
  const scale = Math.min(boxWidth / width, boxHeight / height);
  return { width: width * scale, height: height * scale };
}

function readDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("The company logo could not be read."));
    reader.onabort = reader.onerror;
    reader.readAsDataURL(blob);
  });
}

function decodePng(dataUrl) {
  const binary = atob(dataUrl.slice(PNG_PREFIX.length));
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  if (bytes.length < 24 || ![137, 80, 78, 71, 13, 10, 26, 10].every((value, index) => bytes[index] === value)) {
    throw new Error("The company logo is not a valid PNG image.");
  }
  const view = new DataView(bytes.buffer);
  const width = view.getUint32(16);
  const height = view.getUint32(20);
  fitImage(width, height, 1, 1);
  return { dataUrl, bytes, width, height };
}

async function rasterize(dataUrl) {
  if (dataUrl.startsWith(PNG_PREFIX)) {
    const png = decodePng(dataUrl);
    if (png.width <= 700 && png.height <= 700 && png.bytes.length <= 2 * 1024 * 1024) return png;
  }
  return new Promise((resolve, reject) => {
    const image = new Image();
    const timeout = setTimeout(() => fail(), 15000);
    const fail = () => {
      clearTimeout(timeout);
      image.onload = image.onerror = null;
      reject(new Error("The company logo could not be loaded. Please upload it again as PNG or JPEG."));
    };
    image.onerror = fail;
    image.onload = () => {
      try {
        const size = fitImage(image.naturalWidth || image.width, image.naturalHeight || image.height, 700, 700);
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(size.width));
        canvas.height = Math.max(1, Math.round(size.height));
        const context = canvas.getContext("2d");
        if (!context) return fail();
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const result = decodePng(canvas.toDataURL("image/png"));
        clearTimeout(timeout);
        image.onload = image.onerror = null;
        resolve(result);
      } catch { fail(); }
    };
    // Decode from a data URL, so exports do not depend on a cross-origin DOM canvas.
    image.src = dataUrl;
  });
}

export async function loadExportLogo(url) {
  if (!url || typeof url !== "string" || !url.trim()) return null;
  const source = url.trim();
  if (source.startsWith("data:image/")) return rasterize(source);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(source, {
      mode: "cors", credentials: "omit", cache: "no-cache", signal: controller.signal,
      headers: { Accept: "image/png,image/jpeg,image/svg+xml,image/webp;q=0.8,*/*;q=0.1" },
    });
    if (!response.ok) throw new Error("Logo download failed.");
    const blob = await response.blob();
    if (!blob.size || blob.size > 8 * 1024 * 1024) throw new Error("Logo image size is unsupported.");
    return await rasterize(await readDataUrl(blob));
  } catch {
    throw new Error("The company logo could not be loaded. Check your connection or upload the logo again before exporting.");
  } finally { clearTimeout(timeout); }
}

export function triggerBlobDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  // WebKit may still be reading the URL after click() returns.
  setTimeout(() => { link.remove(); URL.revokeObjectURL(url); }, 30000);
}
