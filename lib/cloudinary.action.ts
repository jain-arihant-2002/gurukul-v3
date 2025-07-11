"use server";

import cloudinary from "@/lib/cloudinary";
import { getAuth } from "@/lib/auth/session";
import { ApiResponses } from "@/utils/apiResponse";
import { env } from "@/utils/env";

/**
 * Generates a signature for direct-to-Cloudinary uploads.
 */
export async function generateUploadSignature(folder: string) {
  const { isAuthenticated } = await getAuth();

  if (!isAuthenticated) {
    return ApiResponses.unauthorized("You must be logged in to upload files.");
  }

  const timestamp = Math.round(new Date().getTime() / 1000);

  try {
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: folder, // Organize uploads into folders (e.g., 'courses/<courseId>')
      },
      env.CLOUDINARY_API_SECRET
    );

    return ApiResponses.success({
      timestamp,
      signature,
      cloudName: env.CLOUDINARY_CLOUD_NAME,
      apiKey: env.CLOUDINARY_API_KEY,
      folder,
    });
  } catch (error) {
    console.error("Error generating Cloudinary signature:", error);
    return ApiResponses.internalServerError("Failed to generate upload signature.");
  }
}