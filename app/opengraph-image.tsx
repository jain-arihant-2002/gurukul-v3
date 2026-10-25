import { ImageResponse } from "next/og";
import { SocialCard, socialCardAlt, socialCardContentType, socialCardSize } from "@/lib/og-image";

export const alt = socialCardAlt;
export const size = socialCardSize;
export const contentType = socialCardContentType;

export default function OpenGraphImage() {
    return new ImageResponse(<SocialCard />, { ...socialCardSize });
}
