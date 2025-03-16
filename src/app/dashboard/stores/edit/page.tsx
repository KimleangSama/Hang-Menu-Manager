"use client";;
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
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
import {
    Clock,
    CreditCard,
    Plus,
    Minus,
    Save,
    Loader2,
    DollarSign,
    MapIcon,
    MapPinIcon,
} from "lucide-react";
import { UpdateStoreFormValues, UpdateStoreRequest, updateStoreSchema } from "../../../../types/request/update-store-request";
import { toast } from "sonner";
import { mapUpdateStoreFormValues, parseStoreInfoResponse } from "@/lib/update-store";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ImageUpload from "@/components/shared/form/image/image-upload";
import { fileService } from "@/services/file-service";
import { API_IMAGE_URL } from "@/constants/auth";
import { GOOGLE_MAPS_API_KEY } from "@/constants/api";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AdvancedMarker, APIProvider, ControlPosition, Map } from '@vis.gl/react-google-maps';
import { CustomZoomControl } from "@/components/map-control";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';

export default function StoreEditPage() {
    const [{ responseError, isLoading, isSaving }, setStoreState] = useState({
        responseError: false,
        isLoading: true,
        isSaving: false
    });
    const [file, setFile] = useState<File | null>(null);

    // Group map-related states for better organization
    const [mapSettings, setMapSettings] = useState({
        showGoogleMap: true,
        zoom: 12,
        coordinates: { lat: 11.5564, lng: 104.9282 },
        controlPosition: ControlPosition.RIGHT_BOTTOM,
    });

    const form = useForm<z.infer<typeof updateStoreSchema>>({
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
            paymentMethods: [],
            color: "",
            lat: 11.5564,
            lng: 104.9282,
            showGoogleMap: true,
        },
        resolver: zodResolver(updateStoreSchema),
    });

    const onMarkerDragEnd = (event: { latLng: google.maps.LatLng | null }) => {
        if (event.latLng) {
            const newLat = event.latLng.lat();
            const newLng = event.latLng.lng();
            setMapSettings(prev => ({
                ...prev,
                coordinates: { lat: newLat, lng: newLng }
            }));
        }
    };

    useEffect(() => {
        async function getStoreInfo() {
            try {
                const response = await storeService.getStoreOfUser();
                if (response.success) {
                    parseStoreInfoResponse(form, response);

                    // Handle logo fetching in a safer way
                    const logo = response.payload.logo;
                    if (logo) {
                        try {
                            const res = await fetch(API_IMAGE_URL + logo);
                            const blob = await res.blob();
                            setFile(new File([blob], logo, { type: 'image/jpeg' }));
                        } catch (error) {
                            console.error('Failed to fetch logo: ', error);
                        }
                    }

                    setMapSettings(prev => ({
                        ...prev,
                        showGoogleMap: response.payload.showGoogleMap,
                        coordinates: {
                            lat: response.payload.lat,
                            lng: response.payload.lng
                        }
                    }));
                } else {
                    console.error('Failed to fetch store info: ', response.error);
                    toast.error(`Failed to fetch store info: ${response.error}`);
                    setStoreState(prev => ({ ...prev, responseError: true }));
                }
            } catch (error) {
                console.error('Failed to fetch store info: ', error);
                toast.error(`Failed to fetch store info: ${error}`);
                setStoreState(prev => ({ ...prev, responseError: true }));
            } finally {
                setStoreState(prev => ({ ...prev, isLoading: false }));
            }
        }
        getStoreInfo();
    }, [form]);

    const onSubmit = async (data: UpdateStoreFormValues) => {
        try {
            setStoreState(prev => ({ ...prev, isSaving: true }));

            // Handle file upload
            if (file) {
                const formData = new FormData();
                formData.append('file', file);
                const response = await fileService.updateFile(formData);
                if (response.success) {
                    data.logo = response.payload.name;
                } else {
                    toast.error(`Failed to upload logo: ${response.error}`);
                    return;
                }
            }

            // Add map data to submission
            const { coordinates, showGoogleMap } = mapSettings;
            data.lat = coordinates.lat;
            data.lng = coordinates.lng;
            data.showGoogleMap = showGoogleMap;
            const toUpdateData: UpdateStoreRequest = mapUpdateStoreFormValues(data);
            const response = await storeService.updateStoreInfo(
                data.id,
                toUpdateData
            );

            if (response.success) {
                toast.success('Store updated successfully');
            } else {
                console.error('Failed to update store: ', response.error);
                toast.error(`Failed to update store: ${response.error}`);
            }
        } catch (error) {
            console.error('Failed to update store: ', error);
            toast.error(`Failed to update store: ${error}`);
        } finally {
            setStoreState(prev => ({ ...prev, isSaving: false }));
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
        form.setValue('orderOptions', (currentOptions ?? []).filter((_, i) => i !== index));
    };

    function removeFeeRange(orderIndex: number, feeIndex: number) {
        const currentOptions = form.getValues('orderOptions');
        const updatedFeeRanges = currentOptions?.[orderIndex]?.feeRanges?.filter((_, i) => i !== feeIndex) || [];
        (currentOptions ?? [])[orderIndex].feeRanges = updatedFeeRanges;
        form.setValue('orderOptions', currentOptions);
    }

    function addFeeRange(orderIndex: number) {
        const currentOptions = form.getValues('orderOptions');
        const currentFees = (currentOptions?.[orderIndex]?.feeRanges ?? []);
        (currentOptions ?? [])[orderIndex].feeRanges = [
            ...currentFees,
            { id: "", condition: '', fee: "0" }
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
            <div className="max-w-4xl mx-auto p-4 space-y-6">
                <h1 className="text-3xl font-bold">Loading...</h1>
            </div>
        );
    }

    if (responseError) {
        return (
            <div className="max-w-4xl mx-auto p-4 space-y-6">
                <h1 className="text-3xl font-bold">Failed to fetch store information</h1>
            </div>
        );
    }

    return (
        <>
            <div className={`max-w-4xl mx-auto p-4 space-y-6`}>
                <div className="flex justify-between items-center sticky top-2 z-10 backdrop-blur-sm">
                    <h1 className="text-3xl font-bold">Edit Store Info</h1>
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
                                        render={({ }) => (
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
                                                                        reset={false}
                                                                        previewUrl={file ? URL.createObjectURL(file) : undefined}
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

                                    <img src={file ? URL.createObjectURL(file) : undefined} alt="logo" className="w-24 h-24 object-cover" />

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
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle className="flex items-center gap-2 text-xl">
                                        <MapIcon className="w-5 h-5" />
                                        Virtual Address (Google Map)
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center">
                                    <Checkbox
                                        id="virtual-address"
                                        defaultChecked={mapSettings.showGoogleMap}
                                        onCheckedChange={() => setMapSettings(prev => ({ ...prev, showGoogleMap: !prev.showGoogleMap }))}
                                    />
                                    <Label htmlFor="virtual-address" className="ml-2">Display Virtual Address</Label>
                                </div>
                                {mapSettings.showGoogleMap && (
                                    <APIProvider apiKey={GOOGLE_MAPS_API_KEY} libraries={['marker']}>
                                        <Map
                                            mapId="8688fdcc01587e0f"
                                            style={{ width: '100%', height: '400px' }}
                                            defaultCenter={mapSettings.coordinates}
                                            gestureHandling={'greedy'}
                                            disableDefaultUI={true}
                                            zoom={mapSettings.zoom}
                                            onZoomChanged={ev => setMapSettings(prev => ({ ...prev, zoom: ev.detail.zoom }))}
                                        >
                                            <AdvancedMarker
                                                title={'Store Location'}
                                                position={mapSettings.coordinates}
                                                draggable
                                                onDragEnd={onMarkerDragEnd}
                                            >
                                                <div className="custom-pin">
                                                    <MapPinIcon className="w-10 h-10 text-red-500" />
                                                </div>
                                            </AdvancedMarker>
                                            <CustomZoomControl
                                                controlPosition={mapSettings.controlPosition}
                                                zoom={mapSettings.zoom}
                                                onZoomChange={zoom => setMapSettings(prev => ({ ...prev, zoom }))}
                                            />
                                        </Map>
                                    </APIProvider>
                                )}
                            </CardContent>
                        </Card>
                    </form>
                </Form>
            </div>
        </>
    );
}
