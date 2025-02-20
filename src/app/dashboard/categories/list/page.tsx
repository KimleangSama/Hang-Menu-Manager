"use client";

import { useEffect, useState } from "react";
import DashboardPage from "../../page";
import TableListContextProvider, { TableListDialogType } from "@/providers/table-list-provider";
import useDialogState from "@/hooks/use-dialog";
import { toast } from "sonner";
import Link from "next/link";
import { CategoryResponse } from "@/types/category-response";
import { categoryService } from "@/services/category-service";
import { DataTable } from "@/components/categories/category-data";
import { categoryColumns } from "@/components/categories/category-column";

export default function ListCategoryPage() {
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [currentRow, setCurrentRow] = useState<CategoryResponse | null>(null)
    const [open, setOpen] = useDialogState<TableListDialogType>(null)

    useEffect(() => {
        async function fetchCategoryList() {
            try {
                const response = await categoryService.listCategories();
                if (response.success) {
                    setCategories(response.payload);
                } else {
                    toast.error(response.error);
                }
            } catch (error) {
                toast.error(String(error));
            }
        }
        fetchCategoryList();
    }, []);

    return (
        <DashboardPage>
            <div className="p-4 space-y-6">
                <div className="flex justify-between items-center sticky top-2 z-10 backdrop-blur-sm">
                    <h1 className="text-3xl font-bold">List Category</h1>
                    <Link href="/dashboard/categories/create" className="bg-gray-200 px-4 py-1 text-black rounded-md hover:bg-primary-600">
                        Create
                    </Link>
                </div>
                <TableListContextProvider value={{ open, setOpen, currentRow, setCurrentRow }}>
                    <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
                        <DataTable data={categories} columns={categoryColumns} />
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