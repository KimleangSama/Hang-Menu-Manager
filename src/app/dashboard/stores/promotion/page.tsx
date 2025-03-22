"use client";

import ImageUpload from "@/components/shared/form/image/image-upload";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { fileService } from "@/services/file-service";
import { useStoreResponse } from "@/hooks/use-store";
import { toast } from "sonner";
import { API_IMAGE_URL } from "@/constants/auth";
import NoStore from "@/components/no-store";

const PromotionPage = () => {
    const store = useStoreResponse(state => state.store);
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (store?.promotion) {
            setFiles([new File([], store.promotion)]);
        }
    }, [store]);

    if (!store) {
        return <NoStore />;
    }

    // Remove a file by index
    const removeFile = (indexToRemove: number) => {
        setFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
    };

    const handleUploadPromotions = async () => {
        setLoading(true);
        try {
            const fd = new FormData();
            files.forEach(file => {
                fd.append('file', file, file.name);
            });
            const fileResponse = await fileService.uploadFile(store?.id, 'store-promotion', fd);
            console.log(fileResponse);
            toast.info('Promotion uploaded successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to upload promotion');
        }
        setLoading(false)
    };

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <h1 className="text-3xl font-bold">Add Or Edit Promotion</h1>

            <div>
                <div className="flex items-center justify-between sticky top-0 bg-white dark:bg-black py-4">
                    <Button disabled={files.length < 1} onClick={handleUploadPromotions}>
                        {loading ? 'Uploading...' : 'Upload'}
                    </Button>
                </div>

                <div className="space-y-4 mt-4">
                    <h2 className="text-lg font-semibold">Upload Images</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="file-upload" className="cursor-pointer">
                                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center">
                                    <p className="text-sm text-gray-500">Click to upload and crop files</p>
                                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            </label>
                        </div>
                        {files.length > 0 && (
                            <div className="">
                                <h3 className="text-md font-medium mb-2">Selected Files ({files.length})</h3>
                                <ul className="space-y-2">
                                    {files.map((file, index) => (
                                        <li key={index} className="flex items-center justify-between border-gray-100 border p-2 rounded">
                                            <span className="truncate max-w-xs">{file.name}</span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeFile(index)}
                                                className="h-8 w-8 text-gray-500 hover:text-red-500"
                                            >
                                                <X size={16} />
                                            </Button>
                                        </li>
                                    ))}
                                </ul>

                                {/* Add button to clear all files */}
                                {files.length > 1 && (
                                    <Button
                                        variant="outline"
                                        className="mt-2"
                                        onClick={() => setFiles([])}
                                        size="sm"
                                    >
                                        Remove All
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {(files.length > 0 && !store.promotion) && (
                <div>
                    <h2 className="text-xl my-4">Preview</h2>
                    <Swiper navigation={true} modules={[Navigation]} className="mySwiper">
                        {files.map((file, index) => (
                            <SwiperSlide key={index}>
                                <img src={URL.createObjectURL(file)} alt="" className="object-cover w-full h-full" />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}
            {store.promotion && (
                <div>
                    <h2 className="text-xl my-4">Current Promotion</h2>
                    <img src={API_IMAGE_URL + store.promotion} alt="" className="object-cover w-full h-full" />
                </div>
            )}

            <Dialog>
                <DialogTrigger asChild id="file-upload">
                    <Button variant="outline" className="hidden">Edit Promotion</Button>
                </DialogTrigger>
                <DialogContent className="max-w-[800px]">
                    <DialogHeader>
                        <DialogTitle>Upload and Crop</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <ImageUpload
                            title="Upload Promotion"
                            onUpload={(file) => {
                                // setFiles((prevFiles) => [...prevFiles, file]);
                                setFiles([file]);
                                store.promotion = '';
                            }}
                            reset={false}
                            aspect={2}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PromotionPage;