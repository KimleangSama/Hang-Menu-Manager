import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/shared/table/data-table-column-header'
import LongText from '@/components/shared/text/long-text'
import { API_BASE_URL } from '@/constants/auth'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { MenuResponse } from '@/types/menu-response'
import { DataTableRowActions } from './menu-row-action'

export const menuColumns: ColumnDef<MenuResponse>[] = [
    {
        accessorKey: 'image',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Image' />
        ),
        cell: ({ row }) => {
            const { image, name } = row.original
            if (!image) return (<img src={`https://ui-avatars.com/api/?name=` + name} alt='Menu Image' className='rounded w-8 h-8' />)
            return (
                <Popover>
                    <PopoverTrigger>
                        <div className='flex items-center justify-center'>
                            <img src={API_BASE_URL + "/files/view/" + image} alt='Menu Image' className='w-8 h-8' />
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className='w-92'>
                        <div className='flex items-center justify-center'>
                            <img src={API_BASE_URL + "/files/view/" + image} alt='Menu Image' className='w-full' />
                        </div>
                    </PopoverContent>
                </Popover>
            )
        },
    },
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Name' />
        ),
        cell: ({ row }) => <div className='w-fit text-nowrap'>{row.getValue('name')}</div>,
    },
    {
        accessorKey: 'description',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Description' />
        ),
        cell: ({ row }) => <LongText>{row.getValue('description')}</LongText>,
        enableSorting: false,
    },
    {
        accessorKey: 'price',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Price' />
        ),
        cell: ({ row }) => {
            const { currency, price } = row.original;
            const formattedPrice = typeof price === 'number' && !isNaN(price)
                ? price.toFixed(2)
                : price; // Fallback for non-numeric values
            return (
                <div>
                    {currency === 'dollar' ? `USD ${formattedPrice}` : `KHR ${price}`}
                </div>
            );
        },
    },
    {
        accessorKey: 'discount',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Discount' />
        ),
        cell: ({ row }) => {
            const { currency, discount } = row.original;
            const formattedDiscount = typeof discount === 'number' && !isNaN(discount)
                ? discount.toFixed(2)
                : discount; // Fallback for non-numeric values
            return (
                <div>
                    {currency === 'dollar' ? `USD ${formattedDiscount}` : `KHR ${discount}`}
                </div>
            );
        }
    },
    {
        accessorKey: 'categoryName',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Category' />
        ),
        cell: ({ row }) => <div>{row.getValue('categoryName')}</div>,
    },
    {
        accessorKey: 'available',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Available' />
        ),
        cell: ({ row }) => (
            <Badge variant={row.getValue('available') ? 'default' : 'destructive'}>
                {row.getValue('available') ? 'Yes' : 'No'}
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