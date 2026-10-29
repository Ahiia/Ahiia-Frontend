/**
 * Convert any File (small KB or huge MB) into a clean, optimized data URL.
 * Automatically downscales large images (e.g. >400KB) to standard logo dimensions (max 800px)
 * so that any size logo (KB or MB) is accepted and processed smoothly.
 */
const fileToDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    // If it's SVG, read directly as data URL without rasterizing
    if (
      file.type === "image/svg+xml" ||
      file.name?.toLowerCase().endsWith(".svg")
    ) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
      return;
    }

    // For raster images (PNG, JPEG, WEBP, etc.)
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // If image is already lightweight (< 350KB), keep original data url
        if (file.size < 350 * 1024) {
          return resolve(e.target.result);
        }

        // Downscale large files so any KB/MB is accepted seamlessly
        const maxDimension = 800;
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const mime = file.type === "image/png" ? "image/png" : "image/jpeg";
        resolve(canvas.toDataURL(mime, 0.88));
      };
      img.onerror = () => resolve(e.target.result); // Fallback to raw data url
      img.src = e.target.result;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

export const uploadImageToCloudinary = async (file) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  // If Cloudinary credentials are provided, attempt cloud upload first
  if (cloudName && uploadPreset) {
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", uploadPreset);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: data },
      );
      const json = await res.json();

      if (res.ok && json.secure_url) {
        return json.secure_url;
      }

      console.warn(
        "Cloudinary upload rejected (" +
          (json?.error?.message || "error") +
          "), falling back to optimized local data URL.",
      );
    } catch (err) {
      console.warn(
        "Cloudinary network error, falling back to optimized local data URL:",
        err,
      );
    }
  }

  // Resilient fallback: convert any image (KB or MB) into an optimized data URL
  return await fileToDataUrl(file);
};
