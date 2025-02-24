"use client";

import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import DashboardPage from '../../page';
import { CreateMenuFormData, createMenuSchema } from '../../../../types/request/create-menu-request';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CategoryResponse } from '../../../../types/category-response';
import { categoryService } from '@/services/category-service';
import { toast } from 'sonner';
import { menuService } from '@/services/menu-service';
import { fileService } from '@/services/file-service';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { useStoreResponse } from '@/hooks/use-store';
import { CustomDragDrop, FileFormat } from '@/components/shared/form/image/custom-drag-drop';
import { compressFile } from '@/lib/helpers';
import PreviewMenu from '@/components/menus/preview';
import ImageUpload from '@/components/shared/form/image/image-upload';

const CreateMenuPage = () => {
    const store = useStoreResponse(state => state.store);
    const [file, setFile] = useState<File | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [images, setImages] = useState<FileFormat[]>([]);
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const form = useForm<z.infer<typeof createMenuSchema>>({
        defaultValues: {
            code: '',
            name: '',
            description: '',
            price: "0",
            discount: "0",
            currency: "dollar",
            image: '',
            images: [],
            categoryId: '',
            available: true,
            storeId: store?.id || '',
        },
        resolver: zodResolver(createMenuSchema),
    })

    const [preview, setPreview] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const onSubmit = async (data: CreateMenuFormData) => {
        try {
            setIsSubmitting(true);
            setMessage(null);

            if (!file) {
                throw new Error("Image is required");
            }

            // Create menu
            const response = await menuService.createMenu(data);
            if (response.statusCode === 409) {
                throw new Error("Menu code already exists.");
            } else if (!response.success) {
                throw new Error(response.error);
            }

            setMessage({ type: "success", text: "Menu created successfully!" });
            toast.success("Menu created successfully!");
            // form.reset();

            const fd = new FormData();
            fd.append("file", file, "menu.png");
            const uploadResponse = await fileService.uploadFile(response.payload.id, fd);
            if (!uploadResponse.success) throw new Error(uploadResponse.error);

            //// Upload primary image
            // const fd = new FormData();
            // fd.append("file", await handleCompressFile(file), "menu.png");
            // const uploadResponse = await fileService.uploadFile(fd);
            // if (!uploadResponse.success) throw new Error(uploadResponse.error);
            // data.image = uploadResponse.payload.name;

            //// Upload additional images (if any)
            // if (files.length > 0) {
            //     const fdImages = new FormData();
            //     for (const f of files) {
            //         fdImages.append("files", await handleCompressFile(f), f.name);
            //     }
            //     const uploadImagesResponse = await fileService.uploadFiles(fdImages);
            //     if (!uploadImagesResponse.success) throw new Error(uploadImagesResponse.error);
            //     data.images = uploadImagesResponse.payload.map(image => {
            //         return {
            //             name: image.name,
            //             url: image.url,
            //         };
            //     });
            // }
        } catch (error: any) {
            setMessage({ type: "error", text: error.message || "An error occurred." });
        } finally {
            setIsSubmitting(false);
        }
    };

    function uploadImages(uploadedImages: File[], fileFormats: FileFormat[]) {
        setFiles([...files, ...uploadedImages]);
        setImages([...images, ...fileFormats]);
    }

    function deleteImage(indexImg: number) {
        const updatedList = images.filter((_ele, index) => index !== indexImg);
        setFiles(files.filter((_ele, index) => index !== indexImg));
        setImages(updatedList);
    }

    const handleCompressFile = async (file: File) => {
        if (file) {
            try {
                const compressedImageFile = await compressFile(file);
                return compressedImageFile;
            } catch (error) {
                console.log({ error });
                return file;
            }
        }
        return file;
    };

    useEffect(() => {
        async function listCategories() {
            if (store && store.id) {
                const response = await categoryService.listCategories(store?.id);
                if (response.success) {
                    setCategories(response.payload);
                } else {
                    toast.error(response.error);
                    setMessage({ type: "error", text: response.error });
                }
            }
        }
        listCategories();
    }, []);

    return (
        <DashboardPage>
            <div className='mx-auto max-w-6xl'>
                <div className="p-4 space-y-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="sticky top-1 z-10 flex justify-between items-center">
                                <h1 className="text-3xl font-bold">Create Menu</h1>
                                <div className='flex items-center gap-4'>
                                    <Button type='button' variant={'secondary'} onClick={() => setPreview(!preview)}>
                                        {preview ? "Edit" : "Preview"}
                                    </Button>
                                    <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create"}</Button>
                                </div>
                            </div>
                            {preview ? (
                                <PreviewMenu
                                    menu={form.getValues() as CreateMenuFormData}
                                    image={file as File}
                                    images={files}
                                />) :
                                <Card className="p-6">
                                    {message && <Alert className={`mb-2 ${message.type === 'error' ? 'border-red-400' : 'text-green-400 border-green-400'}`} variant={message.type === "error" ? "destructive" : "default"}><AlertDescription>{message.text}</AlertDescription></Alert>}
                                    <div className='grid grid-cols-2 gap-4'>
                                        <div className="space-y-2">
                                            <FormField
                                                name='code'
                                                control={form.control}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Code
                                                            <small className="text-gray-500 dark:text-gray-400"> (Optional)</small>
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <FormField
                                                name='name'
                                                control={form.control}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Name</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <FormField
                                                name='price'
                                                control={form.control}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Price {form.getValues('currency') === 'dollar' ? '($)' : '(៛)'}</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} type='number' />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <FormField
                                                name='discount'
                                                control={form.control}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Discount {form.getValues('currency') === 'dollar' ? '($)' : '(៛)'}</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} type='number' />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <FormField
                                                name='currency'
                                                control={form.control}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Currency</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select Currency" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    <SelectLabel>Currency</SelectLabel>
                                                                    <SelectItem value='dollar'>Dollar</SelectItem>
                                                                    <SelectItem value='riel'>Riel</SelectItem>
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <FormField
                                                name='categoryId'
                                                control={form.control}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Category</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select Category" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    <SelectLabel>Category</SelectLabel>
                                                                    {categories.map(category => (
                                                                        <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                                                                    ))}
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="col-span-2 space-y-2">
                                            <FormField
                                                name='description'
                                                control={form.control}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Description</FormLabel>
                                                        <FormControl>
                                                            <Textarea {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className='space-y-2'>
                                            <ImageUpload
                                                title='Upload Image'
                                                onUpload={(file) => {
                                                    // handleCompressFile(file).then((compressedFile) => {
                                                    //     if (!compressedFile) return;
                                                    //     setFile(compressedFile);
                                                    // });
                                                    setFile(file);
                                                }}
                                                previewUrl={file ? URL.createObjectURL(file) : undefined}
                                            />
                                        </div>

                                        <div className='space-y-2'>
                                            <div className="grid gap-4">
                                                <div className="bg-white dark:bg-[#111111] shadow dark:shadow-white rounded-md w-full px-5 pt-3 pb-5">
                                                    <Label>Slide Images</Label>
                                                    <CustomDragDrop
                                                        pictures={images}
                                                        onUpload={uploadImages}
                                                        onDelete={deleteImage}
                                                        count={4}
                                                        formats={["jpg", "jpeg", "png"]}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            }
                        </form>
                    </Form>
                </div>
            </div>
        </DashboardPage >
    );
};

export default CreateMenuPage;