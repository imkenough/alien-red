import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  src: string;
  title: string;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, title, className }) => {
  const [isLoading, setIsLoading] = useState(true);
  const playerRef = React.useRef<HTMLDivElement>(null);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <div
      ref={playerRef}
      className={cn(
        "relative w-full aspect-video bg-black rounded-lg overflow-hidden",
        className
      )}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      )}

      <iframe
        src={src}
        title={title}
        className="w-full h-full border-0"
        allowFullScreen
        onLoad={handleIframeLoad}
      ></iframe>
    </div>
  );
};

export default VideoPlayer;
