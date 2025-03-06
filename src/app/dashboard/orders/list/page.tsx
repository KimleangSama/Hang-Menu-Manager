"use client";

import { useEffect, useState } from "react";
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
    const storeId = useStoreResponse(state => state.store?.id);
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState<OrderListResponse[]>([]);
    const [currentRow, setCurrentRow] = useState<OrderListResponse | null>(null);
    const [open, setOpen] = useDialogState<TableListDialogType>(null);

    useEffect(() => {
        async function fetchOrderList() {
            if (!storeId) return;

            setLoading(true);
            try {
                const response = await orderService.listOrders(storeId);
                if (response.success) {
                    setOrders(response.payload);
                } else {
                    toast.error(response.error);
                }
            } catch (error) {
                toast.error("Failed to fetch orders.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchOrderList();
    }, [storeId]);

    return (
        <div className="px-4 py-3 space-y-6">
            <div className="flex justify-between items-center sticky top-2 z-10 backdrop-blur-sm">
                <h1 className="text-3xl font-bold">List Orders</h1>
            </div>
            <TableListContextProvider value={{ open, setOpen, currentRow, setCurrentRow }}>
                <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                    {loading ? (
                        <DataTableSkeleton columnCount={7} rowCount={15} />
                    ) : (
                        <DataTable data={orders} columns={orderColumns} />
                    )}
                    {/* {open === "edit" && currentRow && (
                        <Dialog open={Boolean(open === "edit")} onOpenChange={() => setOpen(null)}>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Edit Order Status</DialogTitle>
                                    <DialogDescription>Change the status of the order</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="status" className="text-right">
                                            Status
                                        </Label>
                                        <div className="col-span-3">
                                            <Select
                                                defaultValue={currentRow.status}
                                                onValueChange={handleStatusChange}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="pending">Pending</SelectItem>
                                                    <SelectItem value="preparing">Preparing</SelectItem>
                                                    <SelectItem value="completed">Completed</SelectItem>
                                                    <SelectItem value="ready">Ready</SelectItem>
                                                    <SelectItem value="delivered">Delivered</SelectItem>
                                                    <SelectItem value="canceled">Canceled</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" onClick={() => setOpen(null)}>
                                        Close
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )} */}
                </div>
            </TableListContextProvider>
        </div>
    );
}
