"use client";;
import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { categoryService } from '@/services/category-service';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { CreateCategoryFormData, createCategorySchema } from '../../../../types/request/category-request';
import { useStoreResponse } from '@/hooks/use-store';
import NoStore from '@/components/no-store';

const CreateCategoryPage = () => {
    const store = useStoreResponse(state => state.store);
    const [file, setFile] = useState<File | null>(null);
    const form = useForm<z.infer<typeof createCategorySchema>>({
        defaultValues: {
            name: '',
            description: '',
            icon: '',
            hidden: false,
            available: true,
            storeId: store?.id || '',
        },
        resolver: zodResolver(createCategorySchema),
    })

    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data: CreateCategoryFormData) => {
        setIsSubmitting(true);
        try {
            if (file) {
                const fd = new FormData();
                fd.append("file", file, "menu.png");
                // const uploadResponse = await fileService.uploadFile(fd);
                // if (!uploadResponse.success) throw new Error(uploadResponse.error);
                // data.icon = uploadResponse.payload.name;
            }
            data.storeId = store?.id || '';
            const response = await categoryService.createCategory(data);
            if (response.success) {
                toast.success("Menu category created successfully!");
                setFile(null);
            } else {
                if (response.statusCode === 417) {
                    toast.error(`Maximum category reached. Please delete the existing category first.`, {
                        duration: 2500,
                        position: "bottom-center",
                    });
                    return;
                } else if (response.statusCode === 409) {
                    toast.error("Category with this name already exists.");
                } else {
                    toast.error(response.error);
                }
            }
        }
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        return () => {
            setFile(null);
        }
    }, [store]);

    if (!store) return <NoStore />;

    return (
        <div className='mx-auto max-w-4xl'>
            <div className="p-4 space-y-6">
                <Form {...form}>
                    <form className="space-y-6">
                        <div className="sticky top-1 z-10 flex justify-between items-center">
                            <h1 className="text-3xl font-bold">Create Menu Category</h1>
                            <Button type="button" onClick={() => {
                                onSubmit(form.getValues());
                            }} disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create"}</Button>
                        </div>
                        <Card className="p-6">
                            <div className='grid grid-cols-1 gap-4'>
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
        </div>
    );
};

export default CreateCategoryPage;