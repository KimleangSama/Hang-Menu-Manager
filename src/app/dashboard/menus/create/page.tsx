"use client";

import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import DashboardPage from '../../page';
import { CreateMenuFormData, createMenuSchema } from '../../../../types/request/menu-request';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CategoryResponse } from '../../../../types/category-response';
import { categoryService } from '@/services/category-service';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { useStoreResponse } from '@/hooks/use-store';
import { CustomDragDrop, FileFormat } from '@/components/shared/form/image/custom-drag-drop';
import { getCurrencySign, getFullPrice } from '@/lib/helpers';
import ImageUpload from '@/components/shared/form/image/image-upload';
import { FaFacebook, FaInstagram, FaTelegram } from 'react-icons/fa';
import { BADGES } from '@/constants/badges';
import { Checkbox } from '@/components/ui/checkbox';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { menuService } from '@/services/menu-service';
import { fileService } from '@/services/file-service';

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
            badges: [],
            categoryId: '',
            available: true,
            storeId: store?.id || '',
        },
        resolver: zodResolver(createMenuSchema),
    })

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

            const imageFD = new FormData();
            imageFD.append("file", file, file.name);
            const uploadResponse = await fileService.uploadFile(response.payload.id, 'menu', imageFD);
            if (!uploadResponse.success) throw new Error(uploadResponse.error);

            if (files.length > 0) {
                const slideImagesFD = new FormData();
                for (const file of files) {
                    slideImagesFD.append("files", file, file.name);
                }
                const uploadImagesResponse = await fileService.uploadFiles(response.payload.id, 'menu', slideImagesFD);
                if (!uploadImagesResponse.success) throw new Error(uploadImagesResponse.error);
            }
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

    useEffect(() => {
        async function listCategories() {
            if (store && store.id) {
                form.setValue("storeId", store.id);
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
    }, [store]);

    return (
        <DashboardPage>
            <div className='max-w-full flex xl:flex-nowrap flex-wrap'>
                <div className="p-4 w-full space-y-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="sticky top-1 z-10 flex justify-between items-center">
                                <h1 className="text-3xl font-bold">Create Menu</h1>
                                <div className='flex items-center gap-4'>
                                    <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create"}</Button>
                                </div>
                            </div>
                            <Card className="p-6">
                                {form.formState.errors && form.formState.errors.code && <Alert className="mb-2 border-red-400" variant="destructive"><AlertDescription>{form.formState.errors.code.message}</AlertDescription></Alert>}
                                {form.formState.errors && form.formState.errors.name && <Alert className="mb-2 border-red-400" variant="destructive"><AlertDescription>{form.formState.errors.name.message}</AlertDescription></Alert>}
                                {form.formState.errors && form.formState.errors.currency && <Alert className="mb-2 border-red-400" variant="destructive"><AlertDescription>{form.formState.errors.currency.message}</AlertDescription></Alert>}
                                {form.formState.errors && form.formState.errors.categoryId && <Alert className="mb-2 border-red-400" variant="destructive"><AlertDescription>{form.formState.errors.categoryId.message}</AlertDescription></Alert>}
                                {form.formState.errors && form.formState.errors.price && <Alert className="mb-2 border-red-400" variant="destructive"><AlertDescription>{form.formState.errors.price.message}</AlertDescription></Alert>}
                                {form.formState.errors && form.formState.errors.discount && <Alert className="mb-2 border-red-400" variant="destructive"><AlertDescription>{form.formState.errors.discount.message}</AlertDescription></Alert>}
                                {form.formState.errors && form.formState.errors.description && <Alert className="mb-2 border-red-400" variant="destructive"><AlertDescription>{form.formState.errors.description.message}</AlertDescription></Alert>}
                                {form.formState.errors && form.formState.errors.badges && <Alert className="mb-2 border-red-400" variant="destructive"><AlertDescription>{form.formState.errors.badges.message}</AlertDescription></Alert>}
                                {form.formState.errors && form.formState.errors.image && <Alert className="mb-2 border-red-400" variant="destructive"><AlertDescription>{form.formState.errors.image.message}</AlertDescription></Alert>}
                                {form.formState.errors && form.formState.errors.images && <Alert className="mb-2 border-red-400" variant="destructive"><AlertDescription>{form.formState.errors.images.message}</AlertDescription></Alert>}
                                {form.formState.errors && form.formState.errors.storeId && <Alert className="mb-2 border-red-400" variant="destructive"><AlertDescription>{form.formState.errors.storeId.message}</AlertDescription></Alert>}
                                {form.formState.errors && form.formState.errors.available && <Alert className="mb-2 border-red-400" variant="destructive"><AlertDescription>{form.formState.errors.available.message}</AlertDescription></Alert>}
                                {message && <Alert className={`mb-2 ${message.type === 'error' ? 'border-red-400' : 'text-green-400 border-green-400'}`} variant={message.type === "error" ? "destructive" : "default"}><AlertDescription>{message.text}</AlertDescription></Alert>}
                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='space-y-2'>
                                        <ImageUpload
                                            title='Upload Image'
                                            onUpload={(file) => {
                                                setFile(file);
                                            }}
                                            previewUrl={file ? URL.createObjectURL(file) : undefined}
                                        />
                                    </div>

                                    <div className='space-y-2'>
                                        <div className="grid gap-4">
                                            <div className="bg-white dark:bg-[#111111] border rounded-md w-full px-5 pt-3 pb-5">
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
                                            name='currency'
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Currency</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
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
                                            name={"badges"}
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Badge</FormLabel>
                                                    <FormControl>
                                                        <div>
                                                            {BADGES?.map((badge, index) => (
                                                                <div key={index} className="flex items-center space-x-2 my-1">
                                                                    <Checkbox
                                                                        id={String(badge.id)}
                                                                        key={index}
                                                                        onCheckedChange={(checked) => {
                                                                            if (checked) {
                                                                                form.setValue("badges", [...(field.value || []), badge.name]);
                                                                            } else {
                                                                                form.setValue("badges", (field.value || []).filter((b: string) => b !== badge.name));
                                                                            }
                                                                        }}
                                                                    />
                                                                    <label
                                                                        htmlFor={String(badge.id)}
                                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                                        style={{ color: badge.color }}
                                                                    >
                                                                        {badge.name}
                                                                    </label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="space-y-2">
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
                                </div>
                            </Card>
                        </form>
                    </Form>
                </div>
                <div className='p-4 space-y-6 sticky top-0'>
                    <div className="collapse top-1 z-10">
                        <h1 className="text-3xl font-bold">Create Menu</h1>
                    </div>
                    <div className="sticky top-0 mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px]">
                        <div className="h-[32px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -start-[17px] top-[72px] rounded-s-lg"></div>
                        <div className="h-[46px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
                        <div className="h-[46px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
                        <div className="h-[64px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
                        <div className="rounded-[2rem] w-[272px] h-[572px] bg-white dark:bg-gray-800 px-2 py-4 space-y-6 flex flex-col justify-center overflow-auto max-h-full">
                            <div
                                className="relative cursor-pointer border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="absolute top-2 left-2 flex flex-wrap gap-y-1 items-center z-[9999]">
                                    {form.watch('badges')?.map((badge, index) => (
                                        <div key={index} className="text-white text-[10px] px-1.5 py-0.5 rounded-md mr-1"
                                            style={{ backgroundColor: BADGES.find(b => b.name === badge)?.color }}
                                        >
                                            {BADGES.find(b => b.name === badge)?.name}
                                        </div>
                                    ))}
                                </div>
                                <div className='w-full'>
                                    <Swiper
                                        style={{ "--swiper-navigation-color": "red", "--swiper-pagination-color": "red", "--swiper-pagination-bullet-inactive-color": "blue;", "--swiper-navigation-size": '24px' } as React.CSSProperties}
                                        lazyPreloaderClass="swiper-lazy-preloader"
                                        lazyPreloadPrevNext={1}
                                        spaceBetween={30}
                                        slidesPerView={1}
                                        navigation={true}
                                        pagination={{ clickable: true, dynamicBullets: true }}
                                        modules={[Navigation, Pagination]}
                                        className="mySwiper"
                                    >
                                        <SwiperSlide className='relative'>
                                            {file ? <img src={URL.createObjectURL(file)} alt="menu" className="w-full h-[200px] object-cover" /> : <img src="https://placehold.co/40x30" alt="menu" className="w-full h-[200px] object-cover" />}
                                        </SwiperSlide>
                                        {files.map((file, index) => (
                                            <SwiperSlide className='relative' key={index}>
                                                <img src={URL.createObjectURL(file)} alt="menu" className="w-full h-[200px] object-cover" />
                                                <div className="swiper-lazy-preloader swiper-lazy-preloader-red"></div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                                <div className="px-4 py-2">
                                    {form.watch("code") && <h6 className="text-xs text-gray-500">Code: {form.watch("code")}</h6>}
                                    <h3 className="font-semibold">{form.watch("name")}</h3>
                                    <div className='overflow-scroll'>
                                        <p className="text-gray-500 text-xs overflow-auto text-ellipsis">{form.watch("description")}</p>
                                    </div>
                                    {form.watch('discount') && Number(form.watch('discount')) > 0 && <p className='text-red-500 line-through'>{getFullPrice(form.watch('currency'), Number(form.watch('discount')), Number(form.watch('price')))}</p>}
                                    <p style={{ color: store?.color }}>{getCurrencySign(form.watch('currency'))}{Number(form.watch('price'))}</p>
                                </div>
                                <div className='pt-2 flex flex-col items-center justify-center'>
                                    <div className='flex items-center justify-center gap-1'>
                                        <img src={store ? store.logo : "https://placehold.co/600x400"}
                                            onError={(e) => { e.currentTarget.src = "https://placehold.co/600x400" }}
                                            alt="store"
                                            className="w-6 h-6 rounded-full object-cover" />
                                        <p className="text-xs text-gray-500">{store?.name}</p>
                                    </div>
                                    <div className="flex justify-center items-center px-4 py-2 gap-2">
                                        <FaFacebook className="text-blue-500 ml-2" />
                                        <FaTelegram className="text-blue-500" />
                                        <FaInstagram className="text-blue-500" />
                                        <p className="text-xs text-gray-500">Tel: {store?.phone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardPage>
    );
};

export default CreateMenuPage;