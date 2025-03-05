import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/shared/table/data-table-column-header'
import LongText from '@/components/shared/text/long-text'
import { API_BASE_URL } from '@/constants/auth'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { DataTableRowActions } from './category-row-action'
import { CategoryResponse } from '../../types/category-response'
import { RowDragHandleCell } from './category-dnd'

export const categoryColumns: ColumnDef<CategoryResponse>[] = [
    {
        accessorKey: 'id-dnd',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Re-Order' className='text-center' />
        ),
        cell: ({ row }) => <RowDragHandleCell rowId={row.original.id} />,
        enableSorting: false,
        size: 100
    },
    {
        accessorKey: 'icon',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Icon' />
        ),
        cell: ({ row }) => {
            const { icon, name } = row.original
            return (
                <Popover>
                    <PopoverTrigger>
                        <div className='flex items-center justify-center'>
                            <img src={API_BASE_URL + "/files/view/" + icon}
                                alt='Icon'
                                className='w-8 h-8'
                                onError={(e) => {
                                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${name}`
                                    e.currentTarget.className = 'w-8 rounded'
                                }}
                            />
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className='w-92'>
                        <div className='flex items-center justify-center'>
                            <img src={API_BASE_URL + "/files/view/" + icon} alt='Icon' className='w-[400px]'
                                onError={(e) => {
                                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${name}`
                                    e.currentTarget.className = 'rounded'
                                }} />
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
        accessorKey: 'menuCount',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Number of Menus' />
        ),
        cell: ({ row }) => <p>{row.getValue('menuCount')}</p>,
        enableSorting: true,
    },
    {
        accessorKey: 'hidden',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Visiblity' />
        ),
        cell: ({ row }) => {
            const menuCount: number = row.getValue("menuCount");
            const hidden = row.getValue("hidden");

            return (
                <Badge variant={"default"}>
                    {menuCount > 0 ? (hidden ? "Invisible" : "Visible") : "No Menu"}
                </Badge>
            );
        },
    },
    {
        accessorKey: "available",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Available" />
        ),
        cell: ({ row }) => {
            const menuCount: number = row.getValue("menuCount");
            const available = row.getValue("available");

            return (
                <Badge variant={"default"}>
                    {menuCount > 0 ? (available ? "Available" : "Unavailable") : "No Menu"}
                </Badge>
            );
        },
    },
    {
        id: 'actions',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Actions' />
        ),
        cell: DataTableRowActions,
    },
]