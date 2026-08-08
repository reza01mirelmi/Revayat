import { fromBuffer } from "file-type";

const ALLOWED_EXTENSIONS = ["jpg", "png", "webp"];

export async function verifyRealImageType(buffer: Buffer): Promise<boolean> {
  const type = await fromBuffer(buffer);
  if (!type) return false; 
  return ALLOWED_EXTENSIONS.includes(type.ext);
}