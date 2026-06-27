import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

// ==========================================
// 🔒 SECURITY CHECK: Environment Variables
// ==========================================
const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME;
const publicUrl = process.env.R2_PUBLIC_URL;

if (!accountId || !accessKeyId || !secretAccessKey || !bucketName || !publicUrl) {
  throw new Error("Missing Cloudflare R2 environment variables. Check .env.local file.");
}

// ==========================================
// ⚙️ R2 CLIENT INITIALIZATION
// ==========================================
export const r2Client = new S3Client({
  region: "auto", // Cloudflare R2 always uses "auto" for region
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

// ==========================================
// 🚀 SECURE UPLOAD FUNCTION
// ==========================================
export async function uploadFileToR2(file: File, folder: string = "uploads"): Promise<string> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 🛡️ Security: Generating unique file name to prevent overwrite & traversal attacks
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    // Extracting extension safely
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, ""); // Remove malicious characters
    const extension = originalName.split('.').pop() || "bin";
    const fileName = `${folder}/${uniqueSuffix}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    });

    await r2Client.send(command);
    
   // 🔗 Returning the clean public URL
    const safePublicUrl = publicUrl || "";
    const baseUrl = safePublicUrl.endsWith('/') ? safePublicUrl.slice(0, -1) : safePublicUrl;
    return `${baseUrl}/${fileName}`;

  } catch (error) {
    console.error("R2 Upload Error:", error);
    throw new Error("Failed to upload file to Cloudflare storage.");
  }
}

// ==========================================
// 🗑️ SECURE DELETE FUNCTION
// ==========================================
export async function deleteFileFromR2(fileUrl: string): Promise<void> {
  try {
    if (!fileUrl) return;

    // URL থেকে ফাইলের Key (path) বের করা
    // যেমন: https://cdn.domain.com/testimonials/123.jpg থেকে "testimonials/123.jpg" এক্সট্রাক্ট করা
    const url = new URL(fileUrl);
    const fileKey = decodeURIComponent(url.pathname.substring(1));

    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
    });

    await r2Client.send(command);
    console.log(`Successfully deleted from R2: ${fileKey}`);
  } catch (error) {
    console.error("R2 Delete Error:", error);
    throw new Error("Failed to delete file from Cloudflare storage.");
  }
}