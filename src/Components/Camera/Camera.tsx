import React, { useRef, useState } from 'react';
import Measure from 'react-measure';
import { useUserMedia } from '../../hooks/useUserMedia';
import { useScreenRatio } from '../../hooks/useScreenRatio';
import { useOffsets } from '../../hooks/useOffsets';

const CAPTURE_OPTIONS = {
    audio: false,
    video: { facingMode: "environment" },
};

interface IProps {
    onCapture?: Function,
    onClear?: Function
}

function Camera({ onCapture, onClear }: IProps) {
    const canvasRef: React.MutableRefObject<HTMLCanvasElement | null> = useRef(null);
    const videoRef: React.MutableRefObject<HTMLVideoElement | null> = useRef(null);
    const mediaStream = useUserMedia(CAPTURE_OPTIONS);
    const [container, setContainer] = useState({ height: 480, width: 560 });
    const [aspectRatio, calculateRatio] = useScreenRatio(1.586);
    const [isCanvasEmpty, setIsCanvasEmpty] = useState(true);
    const offsets = useOffsets(
        videoRef.current && videoRef.current.videoWidth ? videoRef.current.videoWidth : 0,
        videoRef.current && videoRef.current.videoHeight ? videoRef.current.videoHeight : 0,
        container.width,
        container.height
    );

    if (mediaStream && videoRef.current && !videoRef.current.srcObject) {
        videoRef.current.srcObject = mediaStream;
    }

    function handleResize(contentRect: any) {
        if (typeof (aspectRatio) == 'number')
            setContainer({
                height: Math.round(contentRect.bounds.width / aspectRatio),
                width: contentRect.bounds.width
            });
    }

    function handleCanPlay() {
        if (videoRef.current) {
            calculateRatio(videoRef.current.videoHeight, videoRef.current.videoWidth);
            videoRef.current.play();
        }
    }

    function handleCapture() {
        if (canvasRef.current) {
            const context = canvasRef.current.getContext("2d");

            if (context && videoRef.current) {
                context.drawImage(
                    videoRef.current,
                    offsets.x,
                    offsets.y,
                    container.width,
                    container.height,
                    0,
                    0,
                    container.width,
                    container.height
                );
            }

            if (onCapture)
                canvasRef.current.toBlob(blob => onCapture(blob), "image/jpeg", 1);
            setIsCanvasEmpty(false);
        }
    }

    function handleClear() {
        if (canvasRef.current) {
            const context = canvasRef.current.getContext("2d");

            if (context)
                context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            if (onClear)
                onClear();
            setIsCanvasEmpty(true);
        }
    }

    return (
        <Measure bounds onResize={handleResize}>
            {({ measureRef }: any) => (
                <div>
                    <div ref={measureRef} style={{ height: `${container.height}px` }}>
                        <video
                            ref={videoRef}
                            onCanPlay={handleCanPlay}
                            style={{ top: `-${offsets.y}px`, left: `-${offsets.x}px` }}
                            autoPlay
                            playsInline
                            muted
                        />
                        <canvas
                            ref={canvasRef}
                            width={container.width}
                            height={container.height}
                        />
                    </div>

                    <button onClick={isCanvasEmpty ? handleCapture : handleClear}>
                        {isCanvasEmpty ? "Take a picture" : "Take another picture"}
                    </button>
                </div>
            )}
        </Measure>
    );
}
export default Camera;