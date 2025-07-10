import { v2 as cloudinary } from 'cloudinary';
import { env } from '@/utils/env';

cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME, // You'll need to add these to your .env file
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
});

export function getPublicIdFromUrl(url: string): string | null {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.*?)(?:\.\w+)?$/);
    return match ? match[1] : null;
}

export default cloudinary;