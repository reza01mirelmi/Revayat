import cloudinary from "../config/cloudinary";
import { UploadApiOptions } from "cloudinary";

export function uploadBufferToCloudinary(
  buffer: Buffer,
  options: UploadApiOptions,
): Promise<{ secure_url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err || !result) {
        return reject(err ?? new Error("Cloudinary upload failed."));
      }
      resolve({ secure_url: result.secure_url, public_id: result.public_id });
    });
    stream.end(buffer);
  });
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Failed to delete old Cloudinary asset:", publicId, err);
  }
}
