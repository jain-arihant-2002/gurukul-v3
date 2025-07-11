import { env } from "./env";

export async function convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}


export function getCloudinaryVideoUrl(publicId: string): string {
    const cloudName = env.CLOUDINARY_CLOUD_NAME;
    // We can add transformations here in the future if needed
    // e.g., for different quality levels: 'q_auto:good'
    return `https://res.cloudinary.com/${cloudName}/video/upload/q_auto:good/${publicId}.m3u8`;
}