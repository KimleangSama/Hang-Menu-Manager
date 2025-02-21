import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/shared/table/data-table-column-header'
import LongText from '@/components/shared/text/long-text'
import { OrderListResponse } from '@/types/order-response'
import { DataTableRowActions } from './order-row-action'
import { getStatusLabel } from '@/lib/utils'

export const orderColumns: ColumnDef<OrderListResponse>[] = [
    {
        accessorKey: 'phoneNumber',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Phone Number' />
        ),
        cell: ({ row }) => <div className='w-fit text-nowrap'>{row.getValue('phoneNumber')}</div>,
        enableSorting: true,
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
            <Badge variant={row.getValue('status') ? 'default' : 'destructive'}>
                {getStatusLabel(row.getValue('status'))}
            </Badge>
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