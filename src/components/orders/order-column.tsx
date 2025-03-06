import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/shared/table/data-table-column-header'
import LongText from '@/components/shared/text/long-text'
import { OrderListResponse } from '@/types/order-response'
import { DataTableRowActions } from './order-row-action'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { orderService } from '@/services/order-service'
import { toast } from 'sonner'

export const handleStatusChange = async (id: string | undefined, status: string) => {
    try {
        const res = await orderService.updateOrderStatus(id, status);
        if (!res.success) {
            toast.error(res.error);
        } else {
            toast.success('Order status updated successfully');
        }
    } catch (error) {
        toast.error('Failed to update order status');
        console.error(String(error));
    }
};

export const orderColumns: ColumnDef<OrderListResponse>[] = [
    {
        accessorKey: "code",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Code" />
        ),
        cell: ({ row }) => {
            const { code } = row.original;
            const truncatedCode = code?.length > 16 ? `${code.slice(0, 12)}....` : code;
            return <p className="w-32 truncate">{truncatedCode}</p>;
        },
    },
    {
        accessorKey: 'phoneNumber',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Phone Number' />
        ),
        cell: ({ row }) => <div className='w-fit text-nowrap'>{row.getValue('phoneNumber')}</div>,
    },
    {
        accessorKey: 'specialInstructions',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='User Instructions' />
        ),
        cell: ({ row }) => <LongText>{row.getValue('specialInstructions')}</LongText>,
        enableSorting: false,
    },
    {
        accessorKey: 'totalAmountInDollar',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Dollar' />
        ),
        cell: ({ row }) => {
            const { totalAmountInDollar } = row.original;
            const formattedAmount = typeof totalAmountInDollar === 'number' && !isNaN(totalAmountInDollar)
                ? totalAmountInDollar.toFixed(2)
                : totalAmountInDollar; // Fallback for non-numeric values
            return (
                <div>
                    {/* {currency === 'dollar' ? `USD ${formattedPrice}` : `KHR ${price}`} */}
                    ${formattedAmount}
                </div>
            );
        },
    },
    {
        accessorKey: 'totalAmountInRiel',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Riel' />
        ),
        cell: ({ row }) => {
            const { totalAmountInRiel } = row.original;
            const formattedAmount = typeof totalAmountInRiel === 'number' && !isNaN(totalAmountInRiel)
                ? totalAmountInRiel.toFixed(2)
                : totalAmountInRiel; // Fallback for non-numeric values
            return (
                <div>
                    R{formattedAmount}
                </div>
            );
        },
    },
    {
        accessorKey: 'orderTime',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Order Time' />
        ),
        cell: ({ row }) => <div className='w-fit text-nowrap'>{row.getValue('orderTime')}</div>,
    },
    {
        accessorKey: 'status',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Status' />
        ),
        cell: ({ row }) => (
            <Select
                defaultValue={row.getValue('status')}
                onValueChange={(value) => {
                    handleStatusChange(row.original.id, value);
                }}
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
        ),
    },
    {
        id: 'actions',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Actions' />
        ),
        cell: DataTableRowActions,
    },
]