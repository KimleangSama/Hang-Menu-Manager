"use client";

import { useEffect, useState } from "react";
import DashboardPage from "../../page";
import TableListContextProvider, { TableListDialogType } from "@/providers/table-list-provider";
import useDialogState from "@/hooks/use-dialog";
import { toast } from "sonner";
import Link from "next/link";
import { menuColumns } from "@/components/menus/menu-column";
import { menuService } from "@/services/menu-service";
import { MenuResponse } from "@/types/menu-response";
import { DataTable } from "@/components/menus/menu-data";

export default function ListMenuPage() {
    const [menus, setMenus] = useState<MenuResponse[]>([]);
    const [currentRow, setCurrentRow] = useState<MenuResponse | null>(null)
    const [open, setOpen] = useDialogState<TableListDialogType>(null)

    useEffect(() => {
        async function fetchMenuList() {
            try {
                const response = await menuService.listMenus(0, 10000);
                if (response.success) {
                    setMenus(response.payload);
                } else {
                    toast.error(response.error);
                }
            } catch (error) {
                toast.error(String(error));
            }
        }
        fetchMenuList();
    }, []);

    return (
        <DashboardPage>
            <div className="p-4 space-y-6">
                <div className="flex justify-between items-center sticky top-2 z-10 backdrop-blur-sm">
                    <h1 className="text-3xl font-bold">List Menu Menus</h1>
                    <Link href="/dashboard/menus/create" className="bg-gray-200 px-4 py-1 text-black rounded-md hover:bg-primary-600">
                        Create
                    </Link>
                </div>
                <TableListContextProvider value={{ open, setOpen, currentRow, setCurrentRow }}>
                    <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
                        <DataTable data={menus} columns={menuColumns} />
                        {/* {(open === 'delete' || open === 'edit') && (
                                <EditDeleteAlertDialog
                                    open={open}
                                    setOpen={setOpen}
                                    onEdit={() => {
                                        console.log('first edit')
                                    }}
                                    onDelete={() => {
                                        console.log('first' + 'delete')
                                    }}
                                />
                            )} */}
                    </div>
                </TableListContextProvider>
            </div>
        </DashboardPage>
    )
}