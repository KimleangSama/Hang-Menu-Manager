"use client";

import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { categoryService } from '@/services/category-service';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { CreateCategoryFormData, createCategorySchema } from '../../../../types/request/category-request';
import DashboardPage from '@/app/dashboard/layout';
import { useStoreResponse } from '@/hooks/use-store';

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
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const onSubmit = async (data: CreateCategoryFormData) => {
        setIsSubmitting(true);
        setMessage(null);
        try {
            if (file) {
                const fd = new FormData();
                fd.append("file", file, "menu.png");
                // const uploadResponse = await fileService.uploadFile(fd);
                // if (!uploadResponse.success) throw new Error(uploadResponse.error);
                // data.icon = uploadResponse.payload.name;
            }
            const response = await categoryService.createCategory(data);
            if (response.success) {
                setMessage({ type: "success", text: "Menu category created successfully!" });
                toast.success("Menu category created successfully!");
                setFile(null);
            } else {
                if (response.statusCode === 409) {
                    setMessage({ type: "error", text: "Category with this name already exists." });
                }
            }
        } 
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        catch (error: any) {
            setMessage({ type: "error", text: error.message || "An error occurred." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <DashboardPage>
            <div className='mx-auto max-w-4xl'>
                <div className="p-4 space-y-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="sticky top-1 z-10 flex justify-between items-center">
                                <h1 className="text-3xl font-bold">Create Menu Category</h1>
                                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create"}</Button>
                            </div>
                            <Card className="p-6">
                                {message && <Alert className={`mb-2 ${message.type === 'error' ? '' : 'text-green-500'}`} variant={message.type === "error" ? "destructive" : "default"}><AlertDescription>{message.text}</AlertDescription></Alert>}
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

                                    {/* <div className='space-y-2'>
                                        <ImageUpload
                                            title='Upload Icon'
                                            onUpload={(file) => {
                                                setFile(file);
                                            }}
                                            previewUrl={file ? URL.createObjectURL(file) : ''}
                                        />
                                    </div> */}
                                </div>
                            </Card>
                        </form>
                    </Form>
                </div>
            </div>
        </DashboardPage >
    );
};

export default CreateCategoryPage;