"use client";

import { useEffect, useState } from "react";
import DashboardPage from "../../layout";
import TableListContextProvider, { TableListDialogType } from "@/providers/table-list-provider";
import useDialogState from "@/hooks/use-dialog";
import { toast } from "sonner";
import { OrderListResponse } from "@/types/order-response";
import { orderService } from "@/services/order-service";
import { useStoreResponse } from "@/hooks/use-store";
import { orderColumns } from "@/components/orders/order-column";
import { DataTable } from "@/components/orders/order-data";
import { DataTableSkeleton } from "@/components/shared/table/data-table-skeleton";

export default function ListOrderPage() {
    const store = useStoreResponse(state => state.store);
    const [loading, setLoading] = useState(true)
    const [orders, setOrders] = useState<OrderListResponse[]>([]);
    const [currentRow, setCurrentRow] = useState<OrderListResponse | null>(null)
    const [open, setOpen] = useDialogState<TableListDialogType>(null)

    useEffect(() => {
        async function fetchOrderList() {
            if (store) {
                try {
                    if (store?.id) {
                        const response = await orderService.listOrders(store.id);
                        if (response.success) {
                            setOrders(response.payload);
                        } else {
                            toast.error(response.error);
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            setLoading(false)
        }
        fetchOrderList();
    }, []);

    return (
        <DashboardPage>
            <div className="p-4 space-y-6">
                <div className="flex justify-between items-center sticky top-2 z-10 backdrop-blur-sm">
                    <h1 className="text-3xl font-bold">List Orders</h1>
                </div>
                <TableListContextProvider value={{ open, setOpen, currentRow, setCurrentRow }}>
                    <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
                        {loading ? <DataTableSkeleton columnCount={7} rowCount={15} /> :
                            <DataTable data={orders} columns={orderColumns} />
                        }
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