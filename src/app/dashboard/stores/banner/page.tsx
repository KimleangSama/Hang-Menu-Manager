"use client";

import ImageUpload from "@/components/shared/form/image/image-upload";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const BannerPage = () => {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <h1 className="text-3xl font-bold">Edit Store Banner</h1>
            <div>
                <div className="flex items-center justify-between sticky top-0 bg-white py-4 z-[9999]">
                    <Button disabled={!file} className="btn btn-primary">Save</Button>
                </div>
                <div className="mt-4 bg-gray-200 w-full flex items-center justify-center">
                    <ImageUpload
                        title="Upload Banner"
                        onUpload={(file) => setFile(file)}
                        reset={false}
                        previewUrl={previewUrl}
                        aspect={5}
                    />
                </div>
            </div>
        </div>
    )
}

export default BannerPage;