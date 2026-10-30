import { uploadImageToCloudinary } from "../utils/cloudinary.js";
import { updateBusinessContext, getUserProfile } from "./profile.service.js";

export async function uploadCompanyLogo(file) {
  const logoUrl = await uploadImageToCloudinary(file);
  // Brand Kit's API does not store logoUrl. The company profile is authoritative.
  await updateBusinessContext({ logoUrl });
  const saved = await getUserProfile();
  if ((saved.data || saved).logoUrl !== logoUrl) {
    throw new Error("The logo was uploaded but could not be saved to your company profile. Please retry.");
  }
  return logoUrl;
}
