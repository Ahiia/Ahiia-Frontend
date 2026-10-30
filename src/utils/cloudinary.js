import { loadExportLogo } from "../services/exportAssets.js";

export const uploadImageToCloudinary = async (file) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  if (!cloudName || !uploadPreset) throw new Error("Logo uploads are temporarily unavailable. Please contact support.");
  if (!file || file.size > 8 * 1024 * 1024) throw new Error("Please choose a logo smaller than 8 MB.");
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("The logo file could not be read."));
    reader.readAsDataURL(file);
  });
  const logo = await loadExportLogo(dataUrl);
  const data = new FormData();
  data.append("file", new Blob([logo.bytes], { type: "image/png" }), "company-logo.png");
  data.append("upload_preset", uploadPreset);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST", body: data, signal: controller.signal,
    });
    const result = await response.json();
    if (!response.ok || !result.secure_url?.startsWith("https://res.cloudinary.com/")) {
      throw new Error("The logo could not be uploaded. Please try again.");
    }
    return result.secure_url;
  } finally { clearTimeout(timeout); }
};
