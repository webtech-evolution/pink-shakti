import { storage, appwriteConfig, ID } from "./appwrite";

const { bucketId, endpoint, projectId } = appwriteConfig;

export interface UploadedFile {
  fileId: string;
  url: string;
}

/**
 * Extract the Appwrite file ID from a stored view URL, if present.
 * URLs look like: {endpoint}/storage/buckets/{bucket}/files/{fileId}/view?project=...
 */
export function fileIdFromUrl(url?: string | null): string | null {
  if (!url) return null;
  const m = url.match(/\/files\/([^/]+)\/view/);
  return m ? m[1] : null;
}

export function fileViewUrl(fileId: string): string {
  return `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}`;
}

export async function uploadFile(file: File): Promise<UploadedFile> {
  const created = await storage.createFile(bucketId, ID.unique(), file);
  return { fileId: created.$id, url: fileViewUrl(created.$id) };
}

export async function deleteFileByUrl(url?: string | null): Promise<void> {
  const id = fileIdFromUrl(url);
  if (!id) return;
  try {
    await storage.deleteFile(bucketId, id);
  } catch {
    /* ignore — file may already be gone */
  }
}
