"use client";;
import { DataTableSkeleton } from "@/components/shared/table/data-table-skeleton";
import { staffColumns } from "@/components/staffs/staff-column";
import { DataTable } from "@/components/staffs/staff-data";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import useDialogState from "@/hooks/use-dialog";
import { useStoreResponse } from "@/hooks/use-store";
import TableListContextProvider, { TableListDialogType } from "@/providers/table-list-provider";
import { groupService } from "@/services/group-service";
import { userService } from "@/services/user-service";
import { AddOrRemoveStaffRequest } from "@/types/request/create-staff-request";
import { UserResponse } from "@/types/user-response";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function StaffPage() {
    const store = useStoreResponse(state => state.store)
    const [loading, setLoading] = useState(true)
    const [staffs, setStaffs] = useState<UserResponse[]>([]);
    const [currentRow, setCurrentRow] = useState<UserResponse | null>(null)
    const [open, setOpen] = useDialogState<TableListDialogType>(null)

    useEffect(() => {
        async function fetchStaffs() {
            if (store?.groupId) {
                try {
                    const response = await userService.getMyGroupUsers(store.groupId)
                    if (response.success) {
                        setStaffs(response.payload)
                    }
                } catch (error) {
                    console.error(error)
                }
            }
            setLoading(false)
        }
        fetchStaffs()
    }, [store])

    return (
        <div className="px-4 py-3 space-y-6">
            <div className="flex justify-between items-center sticky top-2 z-10 backdrop-blur-sm">
                <h1 className="text-3xl font-bold">List Staffs</h1>
                <Link href="/dashboard/staffs/create" className="bg-gray-200 px-4 py-1 text-black rounded-md hover:bg-primary-600">
                    Create
                </Link>
            </div>
            <TableListContextProvider value={{ open, setOpen, currentRow, setCurrentRow }}>
                <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
                    {loading ? <DataTableSkeleton columnCount={7} rowCount={10} /> :
                        <DataTable data={staffs} columns={staffColumns} />
                    }
                    <AlertDialog open={open === 'delete'}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your
                                    account and remove your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel
                                    onClick={async () => {
                                        setOpen(null)
                                    }}>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={async () => {
                                    setOpen(null)
                                    const response = await groupService.removeUserFromGroup({
                                        groupId: store?.groupId,
                                        userId: currentRow?.id,
                                        username: currentRow?.username,
                                    } as AddOrRemoveStaffRequest)
                                    if (response.success) {
                                        toast.success("Staff removed successfully")
                                        setStaffs(staffs.filter(staff => staff.id !== currentRow?.id))
                                    } else {
                                        toast.error(response.error || "An unknown error occurred.");
                                    }
                                }}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </TableListContextProvider >
        </div >
    )
}