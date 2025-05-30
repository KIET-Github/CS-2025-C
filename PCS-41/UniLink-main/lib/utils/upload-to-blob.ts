import { put } from "@vercel/blob";
import { nanoid } from "nanoid";

export async function uploadToBlob(
  file: File,
  folder: string = "documents"
): Promise<string> {
  try {
    // Generate a unique filename with original extension
    const extension = file.name.split(".").pop();
    const uniqueFilename = `${folder}/${nanoid()}.${extension}`;

    // Upload to Vercel Blob
    const { url } = await put(uniqueFilename, file, {
      access: "public",
      addRandomSuffix: false, // We're already using nanoid
    });

    console.log("url --uploadToBlob is ", url);

    return url;
  } catch (error) {
    console.error("Error uploading to Vercel Blob:", error);
    throw new Error("Failed to upload file");
  }
}
