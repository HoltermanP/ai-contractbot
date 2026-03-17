import { put, del } from "@vercel/blob";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";

const isProductionWithBlob =
  process.env.NODE_ENV === "production" && process.env.BLOB_READ_WRITE_TOKEN;

/**
 * Slaat een bestand op: lokaal in uploads/ of in productie in Vercel Blob.
 * Retourneert het opgeslagen pad (lokaal) of de blob URL (productie).
 */
export async function storeFile(
  buffer: Buffer,
  filename: string
): Promise<string> {
  if (isProductionWithBlob) {
    const pathname = `documents/${Date.now()}-${filename}`;
    const blob = await put(pathname, buffer, {
      access: "private",
      addRandomSuffix: true,
      contentType: "application/pdf",
    });
    return blob.url;
  }

  const uploadDir = join(process.cwd(), "uploads");
  await mkdir(uploadDir, { recursive: true });
  const filePath = join(uploadDir, `${Date.now()}-${filename}`);
  await writeFile(filePath, buffer);
  return filePath;
}

/**
 * Verwijdert een bestand. Voor Blob-URL's wordt de blob verwijderd; voor lokale paden het bestand.
 */
export async function deleteStoredFile(filePathOrUrl: string): Promise<void> {
  if (filePathOrUrl.startsWith("http")) {
    try {
      await del(filePathOrUrl);
    } catch (e) {
      console.warn("Blob verwijderen mislukt:", e);
    }
    return;
  }
  try {
    await unlink(filePathOrUrl);
  } catch (e) {
    console.warn("Lokaal bestand verwijderen mislukt:", e);
  }
}
