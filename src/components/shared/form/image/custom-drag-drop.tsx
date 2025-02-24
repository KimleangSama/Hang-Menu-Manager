import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Upload, Image, File, X } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { toast } from "sonner";

export type FileFormat = {
    name: string;
    photo: string;
    type: string;
    size: number;
};

type CustomDragDropProps = {
    pictures: FileFormat[];
    onUpload: (files: File[], fileFormats: FileFormat[]) => void;
    onDelete: (index: number) => void;
    count: number;
    formats: string[];
};

export function CustomDragDrop({
    pictures,
    onUpload,
    onDelete,
    count,
    formats,
}: CustomDragDropProps) {
    const dropContainer = useRef<HTMLDivElement | null>(null);
    const [dragging, setDragging] = useState(false);
    const fileRef = useRef<HTMLInputElement | null>(null);

    function handleDrop(
        e: React.DragEvent<HTMLDivElement> | React.ChangeEvent<HTMLInputElement>,
        type: "inputFile" | "dragDrop"
    ) {
        let files: File[];
        if (type === "inputFile") {
            files = Array.from((e.target as HTMLInputElement).files || []);
        } else {
            e.preventDefault();
            e.stopPropagation();
            setDragging(false);
            if ('dataTransfer' in e) {
                files = Array.from(e.dataTransfer.files);
            } else {
                return;
            }
        }

        const allFilesValid = files.every((file) => {
            return formats.some((format) => file.type.endsWith(`/${format}`));
        });

        if (pictures.length >= count) {
            toast.error(`Only ${count} files can be uploaded`, {
                position: "bottom-center",
                richColors: true,
            });
            return;
        }

        if (!allFilesValid) {
            toast.error(`Invalid file format. Please only upload ${formats.join(", ").toUpperCase()}`, {
                position: "bottom-center",
                richColors: true,
            });
            return;
        }

        if (count && count < files.length) {
            toast.error(`Only ${count} files can be uploaded`, {
                position: "bottom-center",
                richColors: true,
            });
            return;
        }

        if (files && files.length) {
            const nFiles = files.map(async (file) => {
                const base64String = await convertFileBase64(file);
                return {
                    name: file.name,
                    photo: base64String,
                    type: file.type,
                    size: file.size,
                };
            });

            Promise.all(nFiles).then((newFiles) => {
                onUpload(files, newFiles);
                toast.success("File uploaded successfully");
            });
        }
    }

    async function convertFileBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                resolve(reader.result as string);
            };
            reader.onerror = (error) => {
                reject(error);
            };
        });
    }

    useEffect(() => {
        function handleDragOver(e: DragEvent) {
            e.preventDefault();
            e.stopPropagation();
            setDragging(true);
        }

        function handleDragLeave(e: DragEvent) {
            e.preventDefault();
            e.stopPropagation();
            setDragging(false);
        }

        if (dropContainer.current) {
            dropContainer.current.addEventListener("dragover", handleDragOver);
            dropContainer.current.addEventListener("drop", (e) => handleDrop(e as unknown as React.DragEvent<HTMLDivElement>, "dragDrop"));
            dropContainer.current.addEventListener("dragleave", handleDragLeave);
        }

        return () => {
            if (dropContainer.current) {
                dropContainer.current.removeEventListener("dragover", handleDragOver);
                dropContainer.current.removeEventListener("drop", (e) => handleDrop(e as unknown as React.DragEvent<HTMLDivElement>, "dragDrop"));
                dropContainer.current.removeEventListener("dragleave", handleDragLeave);
            }
        };
    }, [pictures]);

    return (
        <>
            <div
                className={`${dragging
                    ? "border border-[#2B92EC] bg-[#EDF2FF]"
                    : "border-dashed border-[#e0e0e0]"
                    } flex items-center justify-center mx-auto text-center border-2 rounded-md mt-4 py-5`}
                ref={dropContainer}
            >
                <div className="flex-1 flex flex-col">
                    <div className="mx-auto text-gray-400 mb-2">
                        <Upload />
                    </div>
                    <div className="text-sm font-normal text-gray-500">
                        <input
                            className="opacity-0 hidden"
                            type="file"
                            multiple
                            accept="image/*"
                            ref={fileRef}
                            onChange={(e) => handleDrop(e, "inputFile")}
                        />
                        <span
                            className="text-[#4070f4] cursor-pointer"
                            onClick={() => {
                                fileRef.current?.click();
                            }}
                        >
                            Click to upload
                        </span>{" "}
                        or drag and drop
                    </div>
                    <div className="text-xs font-normal text-gray-500">
                        Only two files PNG, JPG or JPEG
                    </div>
                </div>
            </div>

            {pictures.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-y-3 gap-x-3">
                    {pictures.map((img, index) => (
                        <Dialog key={index}>
                            <DialogTrigger asChild className="cursor-pointer">
                                <div
                                    key={index}
                                    className="w-full px-3 py-3.5 rounded-md bg-slate-100 dark:bg-slate-300 space-y-2">
                                    <div className="flex justify-between">
                                        <div className="flex h-12 justify-start items-center space-x-2">
                                            <div className="text-[#5E62FF] h-full items-center flex cursor-pointer mx-1.5">
                                                {img.type.match(/image.*/i) ? <Image size={40} /> : <File size={40} />}
                                            </div>
                                            <div className="flex-col items-start flex space-y-1">
                                                <div className="text-sm  text-gray-500 dark:text-black">
                                                    {img.name}
                                                </div>
                                                <div className="text-xs text-gray-400 dark:text-black">{`${Math.floor(
                                                    img.size / 1024
                                                )} KB`}</div>
                                            </div>
                                        </div>
                                        <div className="flex justify-end">
                                            <div className="space-y-1 flex-col items-center justify-center" onClick={(e) => {
                                                e.preventDefault();
                                                onDelete(index)
                                            }}>
                                                <div
                                                    className="cursor-pointer justify-center flex"
                                                >
                                                    <X className="text-red-500" />
                                                </div>
                                                <div className="text-xs font-medium text-gray-400 dark:text-black">
                                                    Remove
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </DialogTrigger>
                            <DialogContent className="z-[100] p-2 shadow-xl rounded-md flex justify-center">
                                <img src={img.photo} alt={img.name} className="object-cover" />
                            </DialogContent>
                        </Dialog>
                    )
                    )}
                </div >
            )
            }
        </>
    );
}