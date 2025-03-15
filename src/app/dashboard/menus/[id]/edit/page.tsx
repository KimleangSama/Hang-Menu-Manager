"use client";

import { CustomDragDrop, FileFormat } from "@/components/shared/form/image/custom-drag-drop";
import ImageUpload from "@/components/shared/form/image/image-upload";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { API_IMAGE_URL } from "@/constants/auth";
import { BADGES } from "@/constants/badges";
import { useStoreResponse } from "@/hooks/use-store"
import { getCurrencySign, getFullPrice } from "@/lib/helpers";
import { categoryService } from "@/services/category-service";
import { menuService } from "@/services/menu-service";
import { CategoryResponse } from "@/types/category-response";
import { EditMenuFormData, editMenuSchema } from "@/types/request/menu-request"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams } from "next/navigation";
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { FaFacebook, FaInstagram, FaTelegram } from "react-icons/fa";
import { toast } from "sonner";
import { z } from "zod"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { fileService } from "@/services/file-service";


const EditPage = () => {
    const store = useStoreResponse(state => state.store);
    const params = useParams<{ id: string }>();
    const form = useForm<z.infer<typeof editMenuSchema>>({
        defaultValues: {
            code: '',
            name: '',
            description: '',
            price: "",
            discount: "",
            currency: "dollar",
            image: '',
            images: [],
            badges: [],
            categoryId: '',
            hidden: false,
            storeId: store?.id || '',
        },
        resolver: zodResolver(editMenuSchema),
    })
    const [file, setFile] = useState<File | null>(null);
    const [fileChange, setFileChange] = useState(false);
    const [reset] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [images, setImages] = useState<FileFormat[]>([]);
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    function uploadImages(uploadedImages: File[], fileFormats: FileFormat[]) {
        setFiles([...files, ...uploadedImages]);
        setImages([...images, ...fileFormats]);
    }

    function deleteImage(indexImg: number) {
        const updatedList = images.filter((_ele, index) => index !== indexImg);
        setFiles(files.filter((_ele, index) => index !== indexImg));
        setImages(updatedList);
    }

    const onSubmit = async (data: EditMenuFormData) => {
        if (!store?.id) {
            setMessage({ type: "error", text: "Store information is missing" });
            return;
        }

        setIsSubmitting(true);
        try {
            let fileName = '';
            let fileNames: string[] = [];

            // Upload main image if changed
            if (fileChange && file) {
                const imageFormData = new FormData();
                imageFormData.append("file", file, file.name);
                const res = await fileService.uploadFile(params.id, 'menu', imageFormData);
                if (res.success) {
                    fileName = res.payload.name;
                }
            }

            // Upload slide images if any
            if (files.length > 0) {
                const slideImagesFormData = new FormData();
                files.forEach(f => slideImagesFormData.append("files", f, f.name));
                const res = await fileService.uploadFiles(params.id, 'menu', slideImagesFormData);
                fileNames = res.payload.map(f => f.name);
            }

            // Prepare data for submission
            const toSubmitData = {
                ...data,
                storeId: store.id,
                image: fileChange ? fileName : data.image,
                images: fileNames
            };
            // Update menu
            const res = await menuService.updateMenu(params.id, toSubmitData);
            if (res.success) {
                setMessage({ type: "success", text: "Menu updated successfully" });
                toast.success("Menu updated successfully");
            } else {
                setMessage({ type: "error", text: res.error });
                toast.error(res.error);
            }
        } catch (error) {
            console.error(error);
            setMessage({ type: "error", text: "Failed to update menu" });
            toast.error("Failed to update menu");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Fetch category and menu data
    useEffect(() => {
        async function fetchData() {
            if (!store?.id) return;
            try {
                // Fetch categories
                const categoriesRes = await categoryService.listCategories(store.id);
                if (categoriesRes.success) {
                    setCategories(categoriesRes.payload);
                    // Fetch menu details
                    const menuRes = await menuService.getMenuById(params.id);
                    if (menuRes.success) {
                        const { code, name, description, price, discount, currency, badges, image, images = [], categoryId } = menuRes.payload;
                        form.reset({
                            code,
                            name,
                            description,
                            price: String(price),
                            discount: String(discount),
                            currency,
                            image,
                            badges: badges || [],
                            categoryId,
                            storeId: store.id,
                            hidden: false,
                            images: []
                        });
                        if (image) {
                            try {
                                const response = await fetch(API_IMAGE_URL + image);
                                if (response.ok) {
                                    const blob = await response.blob();
                                    setFile(new File([blob], image, { type: 'image/jpeg' }));
                                }
                            } catch (error) {
                                console.error("Error fetching main image:", error);
                            }
                        }
                        if (images?.length > 0) {
                            const fileFormats = images.map(img => ({
                                name: img.name,
                                photo: API_IMAGE_URL + img.name,
                                type: 'image/jpeg',
                                size: 0
                            }));
                            const fetchImages = async () => {
                                const fetchedFiles = await Promise.all(
                                    fileFormats.map(async (fileFormat) => {
                                        try {
                                            const response = await fetch(fileFormat.photo);
                                            if (response.ok) {
                                                const blob = await response.blob();
                                                return new File([blob], fileFormat.name, { type: 'image/jpeg' });
                                            }
                                            return null;
                                        } catch (error) {
                                            console.error("Error fetching image:", error);
                                            return null;
                                        }
                                    })
                                );
                                setFiles(fetchedFiles.filter((file): file is File => file !== null));
                                setImages(fileFormats);
                            };
                            fetchImages();
                        }
                    } else {
                        toast.error(menuRes.error);
                        setMessage({ type: "error", text: menuRes.error });
                    }
                } else {
                    toast.error(categoriesRes.error);
                    setMessage({ type: "error", text: categoriesRes.error });
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Failed to load menu data");
                setMessage({ type: "error", text: "Failed to load menu data" });
            }
        }
        fetchData();
    }, [store, params.id]);

    if (!store) {
        return (
            <div className='mx-auto w-full max-w-full flex flex-wrap items-start justify-center'>
                <div className="p-4 space-y-6 overflow-auto">
                    <div className="sticky top-1 z-10 flex justify-between items-center">
                        <h1 className="text-3xl font-bold">Loading...</h1>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='max-w-full flex xl:flex-nowrap flex-wrap'>
            <div className="p-4 w-full space-y-6 overflow-auto">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="sticky top-1 z-10 flex justify-between items-center">
                            <h1 className="text-3xl font-bold">Edit Menu Details</h1>
                            <div className='flex items-center gap-4'>
                                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Editing..." : "Edit"}</Button>
                            </div>
                        </div>
                        <Card className="p-6">
                            {message && <Alert className={`mb-2 ${message.type === 'error' ? 'border-red-400' : 'text-green-400 border-green-400'}`} variant={message.type === "error" ? "destructive" : "default"}><AlertDescription>{message.text}</AlertDescription></Alert>}
                            <div className='grid grid-cols-2 gap-4'>
                                <div className='space-y-2'>
                                    <ImageUpload
                                        title='Upload Image'
                                        onUpload={(file) => {
                                            setFile(file);
                                            setFileChange(true)
                                        }}
                                        reset={reset}
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
                                                <Select onValueChange={field.onChange} value={field.value}>
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
                                                <Select onValueChange={field.onChange} value={field.value}>
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
                                                <FormLabel>Price {getCurrencySign(form.getValues('currency'))}</FormLabel>
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
                                                <FormLabel>Discount {getCurrencySign(form.getValues('currency'))}</FormLabel>
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
                                                        {BADGES?.map((badge, index) => {
                                                            const isChecked = field.value?.some(
                                                                (b: string) => b.toLowerCase() === badge.name.toLowerCase()
                                                            );
                                                            return (
                                                                <div key={index} className="flex items-center space-x-2 my-1">
                                                                    <Checkbox
                                                                        id={String(badge.id)}
                                                                        key={index}
                                                                        checked={isChecked}
                                                                        onCheckedChange={(checked) => {
                                                                            let updatedBadges = field.value || [];
                                                                            if (checked) {
                                                                                if (!updatedBadges.some(b => b.toLowerCase() === badge.name.toLowerCase())) {
                                                                                    updatedBadges = [...updatedBadges, badge.name];
                                                                                }
                                                                            } else {
                                                                                updatedBadges = updatedBadges.filter(
                                                                                    (b) => b.toLowerCase() !== badge.name.toLowerCase()
                                                                                );
                                                                            }
                                                                            form.setValue("badges", updatedBadges);
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
                                                            )
                                                        })}
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
                                {form.watch('badges')?.map((badge, index) => {
                                    const matchedBadge = BADGES.find(b => b.name.toLowerCase() === badge.toLowerCase());
                                    return (
                                        <div key={index} className="text-white text-[10px] px-1.5 py-0.5 rounded-md mr-1"
                                            style={{ backgroundColor: matchedBadge?.color || 'gray' }}>
                                            {matchedBadge?.name || badge}
                                        </div>
                                    );
                                })}
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
                                        {file ? <img src={URL.createObjectURL(file)} alt="menu" className="w-full h-[200px] object-cover" /> :
                                            <img
                                                src={API_IMAGE_URL + form.getValues('image')}
                                                alt="menu" onError={(e) => { e.currentTarget.src = "https://placehold.co/600x400" }}
                                                className="w-full h-[200px] object-cover" />
                                        }
                                    </SwiperSlide>
                                    {files?.map((file, index) => (
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
    )
}

export default EditPage;