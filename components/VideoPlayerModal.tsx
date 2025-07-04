"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function VideoPlayerModal({ videoUrl, videoTitle }: { videoUrl: string; videoTitle: string }) {
    const [open, setOpen] = useState(false);

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
                    <video src={videoUrl} controls autoPlay className="w-full rounded" style={{ maxHeight: 400 }} />
                </DialogContent>
            </Dialog>
        </>
    );
}

export default function VideoPlayerModalWrapper(props: { videoUrl: string; videoTitle: string }) {
    return <VideoPlayerModal {...props} />;
}