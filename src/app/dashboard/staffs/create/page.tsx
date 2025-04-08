"use client";;
import NoStore from "@/components/no-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStoreResponse } from "@/hooks/use-store";
import { filterDuplicateEntryMessage } from "@/lib/utils";
import { groupService } from "@/services/group-service";
import { CreateStaffFormData, createStaffSchema } from "@/types/request/create-staff-request";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function CreateStaffPage() {
    const store = useStoreResponse(state => state.store)

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<z.infer<typeof createStaffSchema>>({
        defaultValues: {
            groupId: store?.groupId,
            fullname: "12345678",
            username: "12345678",
            password: "12345678",
            phone: "12345678",
            address: "12345678",
            emergencyContact: "12345678",
            emergencyRelation: "12345678",
            roles: ["staff"],
        },
        resolver: zodResolver(createStaffSchema),
    });

    const onSubmit = async (data: CreateStaffFormData) => {
        try {
            const response = await groupService.registerUserToGroup(data);
            if (response.success) {
                toast.success("Staff created successfully");
            } else {
                if (response.statusCode === 409) {
                    toast.error(filterDuplicateEntryMessage(response.error || "An unknown error occurred."));
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (store?.groupId) {
            setValue("groupId", store.groupId);
        }
    }, [store, setValue]);

    if (!store) return <NoStore />;

    return (
        <div className='max-w-4xl mx-auto flex xl:flex-nowrap flex-wrap'>
            <div className="p-4 w-full space-y-6">
                <div className="flex justify-between items-center sticky top-2 z-10 backdrop-blur-sm">
                    <h1 className="text-3xl font-bold">Create Staff</h1>
                    <Button type="submit" form="form" className="text-gray-600 text-base px-4 py-2 rounded-md">Create</Button>
                </div>
                <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
                    {/* Form to create staff */}
                    <form className="space-y-4" id="form" onSubmit={handleSubmit(onSubmit)}>
                        {Object.keys(errors).length > 0 && (
                            <div className="bg-red-500 text-white p-4 rounded-md">
                                {Object.values(errors).map((error) => (
                                    <p key={error.message} className="text-sm">{error.message}</p>
                                ))}
                            </div>
                        )}
                        <div>
                            <Label htmlFor="fullname" className="block text-sm font-medium text-gray-200">Fullname</Label>
                            <Input
                                {...register("fullname")}
                                type="text" id="fullname" name="fullname" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
                        </div>
                        <div>
                            <Label htmlFor="username" className="block text-sm font-medium text-gray-200">Username</Label>
                            <Input
                                {...register("username")}
                                type="username" id="username" name="username" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
                        </div>
                        <div>
                            <Label htmlFor="password" className="block text-sm font-medium text-gray-200">Password</Label>
                            <Input
                                {...register("password")}
                                type="password" id="password" name="password" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
                        </div>
                        <div>
                            <Label htmlFor="phone" className="block text-sm font-medium text-gray-200">Phone</Label>
                            <Input
                                {...register("phone")}
                                type="text" id="phone" name="phone" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
                        </div>
                        <div>
                            <Label htmlFor="address" className="block text-sm font-medium text-gray-200">Address</Label>
                            <Input
                                {...register("address")}
                                type="text" id="address" name="address" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
                        </div>
                        <div>
                            <Label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-200">Emergency Contact</Label>
                            <Input
                                {...register("emergencyContact")}
                                type="text" id="emergencyContact" name="emergencyContact" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
                        </div>
                        <div>
                            <Label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-200">Emergency Relation</Label>
                            <Input
                                {...register("emergencyRelation")}
                                type="text" id="emergencyRelation" name="emergencyRelation" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
                        </div>
                        <div>
                            <Label htmlFor="role" className="block text-sm font-medium text-gray-200">Role</Label>
                            <div className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm">
                                <Select defaultValue="staff" onValueChange={(value: 'manager' | "staff") => setValue("roles", [value])}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="manager">Manager</SelectItem>
                                        <SelectItem value="staff">Staff</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

