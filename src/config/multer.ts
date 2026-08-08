import multer from "multer";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const upload = multer({
  storage: multer.memoryStorage(), // file stays in RAM, not disk — Render's disk is ephemeral
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(
        new Error("Unsupported file type. Only jpg, png, or webp are allowed."),
      );
    }
    cb(null, true);
  },
});
