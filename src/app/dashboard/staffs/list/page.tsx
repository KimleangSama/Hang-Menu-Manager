"use client";

import { DataTableSkeleton } from "@/components/shared/table/data-table-skeleton";
import { staffColumns } from "@/components/staffs/staff-column";
import { DataTable } from "@/components/staffs/staff-data";
import { useAuth } from "@/hooks/use-auth";
import useDialogState from "@/hooks/use-dialog";
import { useStoreResponse } from "@/hooks/use-store";
import TableListContextProvider, { TableListDialogType } from "@/providers/table-list-provider";
import { userService } from "@/services/user-service";
import { UserResponse } from "@/types/user-response";
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
                    if (!response.success) {
                        console.error(response.error)
                        toast.error(response.error)
                        return
                    } else {
                        console.log(response.payload)
                        setStaffs(response.payload)
                    }
                    setLoading(false)
                } catch (error) {
                    console.error(error)
                }
            }
        }
        fetchStaffs()
    }, [store])

    return (
        <div className="px-4 py-3 space-y-6">
            <div className="flex justify-between items-center sticky top-2 z-10 backdrop-blur-sm">
                <h1 className="text-3xl font-bold">List Staffs</h1>
            </div>
            <TableListContextProvider value={{ open, setOpen, currentRow, setCurrentRow }}>
                <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
                    {loading ? <DataTableSkeleton columnCount={7} rowCount={10} /> :
                        <DataTable data={staffs} columns={staffColumns} />
                    }
                </div>
            </TableListContextProvider>
        </div>
    )
}