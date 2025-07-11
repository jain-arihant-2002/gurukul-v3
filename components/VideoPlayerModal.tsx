"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import VideoJSPlayer from "./VideoJSPlayer";

function VideoPlayerModal({ videoUrl, videoTitle }: { videoUrl: string; videoTitle: string }) {
    const [open, setOpen] = useState(false);
    const videoJsOptions = {
        autoplay: false,
        controls: true,
        responsive: true,
        fluid: true,
        sources: [{
            // Replace this with a public HLS streaming URL from Cloudinary
            src: videoUrl,
            type: 'application/x-mpegURL'
        }]
    };

    return (
        <>
            <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
                Watch
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>{videoTitle}</DialogTitle>
                        <DialogClose />
                    </DialogHeader>
                    <VideoJSPlayer options={videoJsOptions} />
                </DialogContent>
            </Dialog>
        </>
    );
}

export default function VideoPlayerModalWrapper(props: { videoUrl: string; videoTitle: string }) {
    return <VideoPlayerModal {...props} />;
}