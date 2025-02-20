"use client";

import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import DashboardPage from "../../page";
import { storeService } from "@/services/store-service";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Clock, CreditCard, Plus, Minus, Save, Loader2, DollarSign, Copy } from "lucide-react";
import { UpdateStoreFormValues, UpdateStoreRequest } from "@/types/request/update-store-request";
import { toast } from "sonner";
import { mapUpdateStoreFormValues, resetUpdateStoreForm } from "@/lib/update-store";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ImageUpload from "@/components/shared/form/image/image-upload";
import { fileService } from "@/services/file-service";

export default function StoreUpdatePage() {
    const [responseError, setResponseError] = useState(false)
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const form = useForm<UpdateStoreFormValues>({
        defaultValues: {
            id: "",
            name: "",
            description: "",
            logo: "",
            physicalAddress: "",
            virtualAddress: "",
            phone: "",
            email: "",
            website: "",
            facebook: "",
            instagram: "",
            telegram: "",
            operatingHours: [],
            orderOptions: [],
            feeRanges: [],
            paymentMethods: [],
            color: "",
        },
    });

    useEffect(() => {
        async function getStoreInfo() {
            try {
                const response = await storeService.getStoreOfUser();
                if (response.success) {
                    resetUpdateStoreForm(form, response);
                } else {
                    console.error('Failed to fetch store info: ', response.error);
                    toast.error('Failed to fetch store info: ' + response.error);
                    setResponseError(true)
                }
            } catch (error) {
                console.error('Failed to fetch store info: ', error);
                toast.error('Failed to fetch store info: ' + error);
                setResponseError(true)
            }
            setIsLoading(false);
        }
        getStoreInfo();
    }, [form]);

    const onSubmit = async (data: UpdateStoreFormValues) => {
        try {
            setIsSaving(true);
            if (file) {
                const formData = new FormData();
                formData.append('file', file);
                const response = await fileService.uploadFile(formData);
                if (response.success) {
                    data.logo = response.payload.url;
                } else {
                    console.error('Failed to upload logo: ', response.error);
                    toast.error('Failed to upload logo: ' + response.error);
                    setIsSaving(false);
                    return;
                }
            }
            const toUpdateData: UpdateStoreRequest = mapUpdateStoreFormValues(data);
            const response = await storeService.updateStoreInfo(
                data.id,
                toUpdateData
            );
            if (response.success) {
                toast.success('Store updated successfully');
            } else {
                console.error('Failed to update store: ', response.error);
                toast.error('Failed to update store: ' + response.error);
            }
            setIsSaving(false);
        } catch (error) {
            console.error('Failed to update store: ', error);
            toast.error('Failed to update store: ' + error);
            setIsSaving(false);
        }
    };

    const addOrderOption = () => {
        const currentOptions = form.getValues('orderOptions') || [];
        form.setValue('orderOptions', [
            ...currentOptions,
            { id: "", name: '', description: '', feeRanges: [] }
        ]);
    };

    const removeOrderOption = (index: number) => {
        const currentOptions = form.getValues('orderOptions');
        form.setValue('orderOptions', currentOptions.filter((_, i) => i !== index));
    };

    function removeFeeRange(orderIndex: number, feeIndex: number) {
        const currentOptions = form.getValues('orderOptions');
        const updatedFeeRanges = currentOptions[orderIndex].feeRanges.filter((_, i) => i !== feeIndex);
        currentOptions[orderIndex].feeRanges = updatedFeeRanges;
        form.setValue('orderOptions', currentOptions);
    }

    function addFeeRange(orderIndex: number) {
        const currentOptions = form.getValues('orderOptions');
        const currentFees = currentOptions[orderIndex].feeRanges || [];
        currentOptions[orderIndex].feeRanges = [
            ...currentFees,
            { id: "", condition: '', fee: 0 }
        ];
        form.setValue('orderOptions', currentOptions);
    }

    const { fields: operatingHoursFields, append: addOperatingHour, remove: removeOperatingHour } = useFieldArray({
        control: form.control,
        name: "operatingHours",
    });

    const { fields: paymentMethodsFields, append: addPaymentMethod, remove: removePaymentMethod } = useFieldArray({
        control: form.control,
        name: "paymentMethods",
    });

    if (isLoading) {
        return (
            <DashboardPage>
                <div className="max-w-4xl mx-auto p-4 space-y-6">
                    <h1 className="text-3xl font-bold">Loading...</h1>
                </div>
            </DashboardPage>
        );
    }

    if (responseError) {
        return (
            <DashboardPage>
                <div className="max-w-4xl mx-auto p-4 space-y-6">
                    <h1 className="text-3xl font-bold">Failed to fetch store information</h1>
                </div>
            </DashboardPage>
        )
    }

    return (
        <DashboardPage>
            <div className={`max-w-4xl mx-auto p-4 space-y-6`}>
                <div className="flex justify-between items-center sticky top-2 z-10 backdrop-blur-sm">
                    <h1 className="text-3xl font-bold">Update Store Info</h1>
                    <Button
                        type="submit"
                        form="store-form"
                        disabled={isSaving}
                        className="min-w-[120px]"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save
                            </>
                        )}
                    </Button>
                </div>

                <Form {...form}>
                    <form id="store-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Basic Information */}
                        <Input type="hidden" {...form.register('id')} />
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold">Basic Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Store Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
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

                                <div className="flex items-center gap-12">
                                    <FormField
                                        control={form.control}
                                        name="logo"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Logo</FormLabel>
                                                <FormControl>
                                                    <div className="flex items-center gap-4">
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button variant="outline" size="sm">Upload Logo</Button>
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogHeader className="mb-2">
                                                                    <DialogTitle>Upload Logo</DialogTitle>
                                                                </DialogHeader>
                                                                <div className="flex w-full items-center space-x-2">
                                                                    <ImageUpload
                                                                        title='Upload Logo'
                                                                        onUpload={(file) => {
                                                                            setFile(file);
                                                                        }}
                                                                        previewUrl={file ? URL.createObjectURL(file) : ''}
                                                                    />
                                                                </div>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="color"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Theme Color</FormLabel>
                                                <div className="flex gap-4 items-center">
                                                    <FormControl>
                                                        <Input
                                                            type="color"
                                                            {...field}
                                                            className="w-24 h-10 p-1"
                                                        />
                                                    </FormControl>
                                                    <span>{form.watch('color')}</span>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold">Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="physicalAddress"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Address</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="virtualAddress"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Map Address</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="website"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Website</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="facebook"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Facebook</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="instagram"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Instagram</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="telegram"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Telegram</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold">Order Options and Delivery Fees</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {form.watch('orderOptions')?.map((option, index) => (
                                    <div key={option.id || `order-${index}`} className="border rounded p-4 mb-4">
                                        <div className="grid grid-cols-12 gap-4 items-start">
                                            <FormField
                                                control={form.control}
                                                name={`orderOptions.${index}.name`}
                                                render={({ field }) => (
                                                    <FormItem className="col-span-11">
                                                        <FormLabel>Order Option Name</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="mt-8 col-span-1" // Adjusted margin-top
                                                onClick={() => removeOrderOption(index)}
                                            >
                                                <Minus className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        {/* Fee Ranges for each Order Option */}
                                        <div className="ml-6 mt-4">
                                            <div className="flex justify-between items-center">
                                                <CardTitle className="flex items-center gap-2 text-lg">
                                                    <DollarSign className="w-4 h-4" />
                                                    Delivery Fees
                                                </CardTitle>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => addFeeRange(index)} // Pass index here
                                                >
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Add Fee Range
                                                </Button>
                                            </div>
                                            {form.watch(`orderOptions.${index}.feeRanges`)?.map((feeRange, feeIndex) => (
                                                <div key={feeRange.id || `fee-${feeIndex}`} className="grid grid-cols-12 gap-4 items-start mt-4">
                                                    <FormField
                                                        control={form.control}
                                                        name={`orderOptions.${index}.feeRanges.${feeIndex}.condition`}
                                                        render={({ field }) => (
                                                            <FormItem className="col-span-9">
                                                                <FormLabel className="text-sm">Condition</FormLabel>
                                                                <FormControl>
                                                                    <Input {...field} placeholder="e.g., Within 5km, Above $0.5" />
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name={`orderOptions.${index}.feeRanges.${feeIndex}.fee`}
                                                        render={({ field }) => (
                                                            <FormItem className="col-span-2">
                                                                <FormLabel className="text-sm">Fee ($)</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                        type="text"
                                                                        onChange={e => field.onChange(e.target.value)}
                                                                    />
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        className="mt-8 col-span-1"
                                                        onClick={() => removeFeeRange(index, feeIndex)} // Pass both indices
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" onClick={addOrderOption}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Order Option
                                </Button>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle className="flex items-center gap-2 text-xl">
                                        <Clock className="w-5 h-5" />
                                        Operating Hours
                                    </CardTitle>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => addOperatingHour({ id: "", day: "", openTime: "", closeTime: "" })}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Hours
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {operatingHoursFields.map((hours, index) => (
                                    <div key={hours.id || `hours-${index}`} className="grid grid-cols-5 gap-4 mb-4 items-start">
                                        <div className="col-span-2">
                                            <FormField
                                                control={form.control}
                                                name={`operatingHours.${index}.day`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm">Day</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name={`operatingHours.${index}.openTime`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm">Open Time</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} type="text" />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`operatingHours.${index}.closeTime`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm">Close Time</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} type="text" />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="mt-8"
                                            onClick={() => removeOperatingHour(index)}
                                        >
                                            <Minus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle className="flex items-center gap-2 text-xl">
                                        <CreditCard className="w-5 h-5" />
                                        Payment Methods
                                    </CardTitle>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => addPaymentMethod({ id: "", method: "" })}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Method
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-12 gap-4">
                                    {paymentMethodsFields.map((method, index) => (
                                        <div key={method.id} className="col-span-3 flex gap-2">
                                            <FormField
                                                control={form.control}
                                                name={`paymentMethods.${index}.method`}  // Correct path
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm">Method</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="mt-8 px-1"
                                                onClick={() => removePaymentMethod(index)}
                                            >
                                                <Minus className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </form>
                </Form>
            </div>
        </DashboardPage>
    );
}
