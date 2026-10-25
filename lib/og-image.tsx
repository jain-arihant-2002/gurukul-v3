import { SITE_NAME, SOCIAL_IMAGE } from "./seo";
import { SITE_URL } from "./site";

/**
 * Shared 1200x630 social card, served by app/opengraph-image.tsx. Plain ASCII
 * only: the default font in ImageResponse has no guarantee for em dashes.
 */
export const socialCardSize = { width: SOCIAL_IMAGE.width, height: SOCIAL_IMAGE.height };
export const socialCardContentType = "image/png";
export const socialCardAlt = SOCIAL_IMAGE.alt;

const BRAND = "#4ECDC4";
const HOST = new URL(SITE_URL).host;

export function SocialCard() {
    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "64px 72px",
                background: "linear-gradient(135deg, #08090A 0%, #0D1718 55%, #10302D 100%)",
                color: "#F5F7F7",
                fontFamily: "sans-serif",
            }}
        >
            {/* Brand row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "68px",
                            height: "68px",
                            borderRadius: "18px",
                            background: BRAND,
                            color: "#08100F",
                            fontSize: "40px",
                            fontWeight: 800,
                        }}
                    >
                        G
                    </div>
                    <div style={{ display: "flex", fontSize: "40px", fontWeight: 700, color: "#F5F7F7" }}>
                        {SITE_NAME}
                    </div>
                </div>
                <div style={{ display: "flex", fontSize: "22px", color: "#8FA3A2" }}>{HOST}</div>
            </div>

            {/* Headline */}
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <div
                    style={{
                        display: "flex",
                        fontSize: "76px",
                        fontWeight: 800,
                        lineHeight: 1.05,
                        letterSpacing: "-2px",
                        maxWidth: "900px",
                    }}
                >
                    Unlock your potential
                </div>
                <div
                    style={{
                        display: "flex",
                        fontSize: "38px",
                        lineHeight: 1.25,
                        color: "#B6C7C6",
                        maxWidth: "860px",
                    }}
                >
                    Online courses and expert instructors, in one place.
                </div>
            </div>

            {/* Footer chips */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                {["Browse courses", "Meet instructors", "Learn at your pace"].map((label) => (
                    <div
                        key={label}
                        style={{
                            display: "flex",
                            padding: "12px 22px",
                            borderRadius: "999px",
                            border: `1px solid ${BRAND}`,
                            color: BRAND,
                            fontSize: "20px",
                            fontWeight: 600,
                        }}
                    >
                        {label}
                    </div>
                ))}
            </div>
        </div>
    );
}
