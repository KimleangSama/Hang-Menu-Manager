"use client";

import NoStore from "@/components/no-store";
import ImageUpload from "@/components/shared/form/image/image-upload";
import { Button } from "@/components/ui/button";
import { API_IMAGE_URL } from "@/constants/auth";
import { useStoreResponse } from "@/hooks/use-store";
import { fileService } from "@/services/file-service";
import { useState } from "react";
import { toast } from "sonner";

const BannerPage = () => {
    const store = useStoreResponse(state => state.store);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSaveButtonClicked = async () => {
        if (!store || !file) {
            return;
        }
        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await fileService.uploadFile(store.id, "store-banner", formData);
            if (res.success) {
                toast.success("Banner updated successfully. Reload the page to see the changes.");
            } else {
                toast.error("Failed to update banner");
            }
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        } catch (error: any) {
            if (error.status === 403) {
                toast.error("You are not authorized to perform this action.");
            }
        }
        setLoading(false);
    }

    if (!store) {
        return <NoStore />;
    }

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <h1 className="text-3xl font-bold">Edit Store Banner</h1>
            <div>
                <div className="flex items-center justify-between sticky top-0 bg-transparent py-4 z-[9999]">
                    <Button disabled={!file} onClick={handleSaveButtonClicked} className="btn btn-primary">
                        {loading ? "Loading..." : "Save"}
                    </Button>
                </div>
                <div className="mt-4 w-full flex items-center justify-center">
                    <ImageUpload
                        title="Upload Banner"
                        onUpload={(file) => setFile(file)}
                        reset={false}
                        previewUrl={file ? URL.createObjectURL(file) : undefined}
                        aspect={5}
                    />
                </div>
                <p className="text-sm text-gray-500 mt-2">Recommended aspect ratio: 5:1</p>
                {store.banner && (
                    <div>
                        <h2 className="text-xl my-4">Current Banner</h2>
                        <img src={API_IMAGE_URL + store.banner} alt="" className="object-cover w-full h-full" />
                    </div>
                )}
            </div>
        </div>
    )
}

export default BannerPage;