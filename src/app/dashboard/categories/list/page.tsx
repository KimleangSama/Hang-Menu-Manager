"use client";;
import { useEffect, useState } from "react";
import TableListContextProvider, { TableListDialogType } from "@/providers/table-list-provider";
import useDialogState from "@/hooks/use-dialog";
import { toast } from "sonner";
import Link from "next/link";
import { CategoryResponse } from "../../../../types/category-response";
import { categoryService } from "@/services/category-service";
import { DataTable } from "@/components/categories/category-data";
import { categoryColumns } from "@/components/categories/category-column";
import { useStoreResponse } from "@/hooks/use-store";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { UpdateCategoryRequest } from "@/types/request/category-request";

export default function ListCategoryPage() {
    const store = useStoreResponse(state => state.store)
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [currentRow, setCurrentRow] = useState<CategoryResponse | null>(null)
    const [open, setOpen] = useDialogState<TableListDialogType>(null);

    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');

    useEffect(() => {
        async function fetchCategoryList() {
            if (store && store?.id) {
                try {
                    const response = await categoryService.listCategories(store?.id);
                    if (response.success) {
                        setCategories(response.payload);
                    } else {
                        toast.error(response.error);
                    }
                } catch (error) {
                    toast.error(String(error));
                }
            }
        }
        fetchCategoryList();
    }, [store]);

    const handleEditButtonClicked = () => {
        try {
            if (store && store?.id && currentRow?.id) {
                const data: UpdateCategoryRequest = {
                    name,
                    description,
                    storeId: store?.id
                }
                categoryService.updateCategory(currentRow?.id, data)
                    .then(response => {
                        if (response.success) {
                            setCategories(categories.map(category => {
                                if (category.id === currentRow?.id) {
                                    return response.payload;
                                }
                                return category;
                            }));
                            setOpen(null);
                            toast.success("Category updated successfully");
                        } else {
                            console.log(response)
                            if(response.statusCode == 409) {
                                toast.error("Category name already exists");
                                return;
                            }
                            toast.error(response.error);
                        }
                    }).catch(error => {
                        toast.error(String(error));
                    });
            }
        } catch (error) {
            toast.error(String(error));
        }
    }

    return (
        <div className="p-4 space-y-6">
            <div className="flex justify-between items-center sticky top-2 z-10 backdrop-blur-sm">
                <h1 className="text-3xl font-bold">List Category</h1>
                <Link href="/dashboard/categories/create" className="bg-gray-200 px-4 py-1 text-black rounded-md hover:bg-primary-600">
                    Create
                </Link>
            </div>
            <TableListContextProvider value={{ open, setOpen, currentRow, setCurrentRow }}>
                <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
                    <DataTable data={categories} setData={setCategories} columns={categoryColumns} />
                    <AlertDialog open={open === 'edit'}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Edit</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Edit category information
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="space-y-3">
                                <Input
                                    defaultValue={currentRow?.name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <Input
                                    defaultValue={currentRow?.description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                                {/* <div className="flex items-center gap-3">
                                    <Checkbox
                                        defaultChecked={!currentRow?.hidden}
                                    />
                                    <Label className="text-sm">Visible</Label>
                                </div> */}
                            </div>
                            <AlertDialogFooter>
                                <AlertDialogCancel
                                    onClick={() => {
                                        setOpen(null)
                                    }}>
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction onClick={() => {
                                    handleEditButtonClicked()
                                }}>
                                    Save
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </TableListContextProvider>
        </div>
    )
}