"use client";

import { useAuth } from "@/hooks/use-auth";
import { groupService } from "@/services/group-service";
import { UserResponse } from "@/types/user-response";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const StaffViewPage = () => {
    const { user } = useAuth()
    const [usr, setUsr] = useState<UserResponse | null>(null)
    const [notFound, setNotFound] = useState(false)
    const params = useParams<{ id: string }>()

    useEffect(() => {
        async function fetchStaff() {
            if (user) {
                try {
                    const response = await groupService.findMemberOfUser(params.id)
                    if (response.success) {
                        setUsr(response.payload)
                    } else {
                        if(response.statusCode === 404) {
                            toast.error("User not found")
                            setNotFound(true)
                        }
                    }
                } catch (error) {
                    console.error(error)
                }
            }
        }
        fetchStaff()
    }, [user, params.id])

    if (!usr && !notFound) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Loading...</h1>
                    <p className="text-gray-500">Please wait while we fetch the user details.</p>
                </div>
            </div>
        )
    } else if(!usr && notFound) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">User Not Found</h1>
                    <p className="text-gray-500">The user you are looking for does not exist.</p>
                </div>
            </div>
        )
    }

    return (
        <div className='mx-auto max-w-4xl grid grid-cols-3 gap-4'>
            <div className="p-4 space-y-6">
                <div className="sticky top-1 z-10 flex justify-between items-center backdrop:blur-sm">
                    <h1 className="text-3xl font-bold">User Details</h1>
                </div>
                <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                        <img src={usr?.profileUrl} alt="profile" className="w-16 h-16 rounded-full" />
                        <div>
                            <h3 className="text-lg font-semibold">{usr?.username}</h3>
                            <p className="text-sm text-gray-500">{usr?.email}</p>
                        </div>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <h4 className="text-md font-semibold">Roles</h4>
                        {usr?.roles?.map(role => (
                            <span key={role.id} className="bg-gray-200 px-2 py-1 rounded-md">{role.name}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default StaffViewPage;