export const env = {
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,

  DATABASE_URL: process.env.DATABASE_URL ?? "http://localhost:3003",

  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,

  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: Number(process.env.SMTP_PORT) ?? 465,
  EMAIL: process.env.EMAIL,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  EMAIL_FROM: process.env.EMAIL_FROM ?? "Serve File Server",

  MAX_FILE_SIZE: Number(process.env.MAX_FILE_SIZE) ?? 50,
  NEXT_PUBLIC_MAX_FILE_SIZE:
    Number(process.env.NEXT_PUBLIC_MAX_FILE_SIZE) ?? 50,

  UPLOAD_DIR: process.env.UPLOAD_DIR ?? "uploads",

  ORIGINAL_MAX_DIM: Number(process.env.ORIGINAL_MAX_DIM) ?? 2560,
  PLACEHOLDER_QUALITY: Number(process.env.PLACEHOLDER_QUALITY) ?? 60,
  PLACEHOLDER_WIDTH: Number(process.env.PLACEHOLDER_WIDTH) ?? 360,
};
