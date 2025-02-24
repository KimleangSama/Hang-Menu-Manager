import { useRef, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ReactCrop, {
    centerCrop,
    makeAspectCrop,
    Crop,
    PixelCrop,
} from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from "@/components/ui/button";
import { useDebounceEffect } from "@/hooks/use-debounce";
import { canvasPreview } from "./canvas-preview";
import { toast } from "sonner";

export interface ImageUploadProps {
    title: string;
    onUpload: (file: File) => void;
    previewUrl?: string;
}

function centerAspectCrop(
    mediaWidth: number,
    mediaHeight: number,
    aspect: number,
) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    )
}

export default function ImageUpload({ title, onUpload, previewUrl }: ImageUploadProps) {
    const imgRef = useRef<HTMLImageElement>(null)
    const previewCanvasRef = useRef<HTMLCanvasElement>(null)
    const [isCropped, setIsCropped] = useState(false)
    const [crop, setCrop] = useState<Crop>()
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
    const [scale,] = useState(1)
    const [aspect,] = useState<number | undefined>(4 / 3)
    const [imagePreview, setImagePreview] = useState<string | null>(previewUrl || null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.size < 5242880) {
            const preview = URL.createObjectURL(file);
            setImagePreview(preview);
            setIsCropped(false)
        } else {
            setImagePreview(null)
            setIsCropped(false)
            toast.error('File cannot be larger than 5MB')
        }
    };

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        if (aspect) {
            const { width, height } = e.currentTarget
            setCrop(centerAspectCrop(width, height, aspect))
        }
    }

    useDebounceEffect(
        async () => {
            if (
                completedCrop?.width &&
                completedCrop?.height &&
                imgRef.current &&
                previewCanvasRef.current
            ) {
                // We use canvasPreview as it's much faster than imgPreview.
                canvasPreview(
                    imgRef.current,
                    previewCanvasRef.current,
                    completedCrop,
                    scale,
                )
            }
        },
        100,
        [completedCrop, scale],
    )


    return (
        <Card className="w-full">
            <CardHeader>
                <Label>{title}</Label>
            </CardHeader>
            <CardContent>
                <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                />
                <div>
                    {imagePreview && !isCropped && (
                        <ReactCrop
                            crop={crop}
                            onChange={(_, percentCrop) => setCrop(percentCrop)}
                            onComplete={(c) => setCompletedCrop(c)}
                            aspect={aspect}
                            minHeight={100}
                            className="mt-2"
                        >
                            <img
                                ref={imgRef}
                                alt="Crop me"
                                src={imagePreview}
                                style={{ transform: `scale(${scale})` }}
                                onLoad={onImageLoad}
                            />
                        </ReactCrop>
                    )}
                </div>
                <div className={`${isCropped ? 'mt-4' : 'hidden'}`}>
                    <canvas
                        ref={previewCanvasRef}
                        style={{
                            border: '1px solid black',
                            objectFit: 'contain',
                            width: completedCrop?.width,
                            height: completedCrop?.height,
                        }}
                    />
                </div>
                <div className="mt-4">
                    <Button type="button" onClick={async () => {
                        if (completedCrop && imgRef.current) {
                            const image = imgRef.current
                            const previewCanvas = previewCanvasRef.current
                            if (!image || !previewCanvas || !completedCrop) {
                                throw new Error('Crop canvas does not exist')
                            }
                            const scaleX = image.naturalWidth / image.width
                            const scaleY = image.naturalHeight / image.height

                            const offscreen = new OffscreenCanvas(
                                completedCrop.width * scaleX,
                                completedCrop.height * scaleY,
                            )
                            const ctx = offscreen.getContext('2d')
                            if (!ctx) {
                                throw new Error('No 2d context')
                            }
                            ctx.drawImage(
                                previewCanvas,
                                0,
                                0,
                                previewCanvas.width,
                                previewCanvas.height,
                                0,
                                0,
                                offscreen.width,
                                offscreen.height,
                            )
                            // You might want { type: "image/jpeg", quality: <0 to 1> } to
                            // reduce image size
                            const blob = await offscreen.convertToBlob({
                                type: 'image/png',
                            })
                            // Convert blob to file
                            const file = new File([blob], 'image.png', { type: 'image/png' })
                            onUpload(file)
                            setIsCropped(true)
                        }
                    }}
                        disabled={!completedCrop || !imgRef.current || !previewCanvasRef.current}
                    >
                        {isCropped ? 'Cropped' : 'Crop'}
                    </Button>
                </div>
            </CardContent>
        </Card >
    );
}