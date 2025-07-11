import VideoJSPlayer from "@/components/VideoJSPlayer";
import type { Lecture } from "@/utils/types";
import { Lock } from "lucide-react";

interface VideoDisplayProps {
    lecture: Lecture | null;
}

export function VideoDisplay({ lecture }: VideoDisplayProps) {
    if (!lecture) {
        return (
            <div className="flex h-full flex-col items-center justify-center bg-muted">
                <h2 className="text-xl font-semibold">Select a lecture to begin</h2>
                <p className="text-muted-foreground">Choose a lecture from the sidebar to start learning.</p>
            </div>
        );
    }

    // Check if it's a video lecture and has a public ID
    const canPlayVideo = lecture.type === 'video' && lecture.videoUrl;

    return (
        <div className="flex h-full flex-col">
            <div className="flex-1 bg-black">
                {canPlayVideo ? (
                    <VideoJSPlayer
                        options={{
                            autoplay: true,
                            controls: true,
                            responsive: true,
                            fluid: true,
                            sources: [{
                                src: lecture.videoUrl!,
                                type: 'application/x-mpegURL'
                            }]
                        }}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted text-center">
                        <div>
                            <Lock className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-2 text-lg font-medium">Video content not available</h3>
                            <p className="text-sm text-muted-foreground">This lecture type does not contain a video.</p>
                        </div>
                    </div>
                )}
            </div>
            <div className="border-t p-4">
                <h1 className="text-2xl font-bold">{lecture.title}</h1>
                {/* We can add lecture description or other elements here in the future */}
            </div>
        </div>
    );
}