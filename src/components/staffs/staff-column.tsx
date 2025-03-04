import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/shared/table/data-table-column-header'
import { DataTableRowActions } from './staff-row-action'
import { UserResponse } from '@/types/user-response'
import { API_IMAGE_URL } from '@/constants/auth'

export const staffColumns: ColumnDef<UserResponse>[] = [
    // {
    //     accessorKey: 'username',
    //     header: ({ column }) => (
    //         <DataTableColumnHeader column={column} title='Username' />
    //     ),
    //     cell: ({ row }) => <div className='w-fit text-nowrap'>{row.getValue('username')}</div>,
    // },
    {
        accessorKey: 'fullname',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Full Name' />
        ),
        cell: ({ row }) => <div className='w-fit text-nowrap'>{row.getValue('fullname')}</div>,
    },
    {
        accessorKey: 'profileUrl',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Profile' />
        ),
        cell: ({ row }) => {
            const profileUrl = row.getValue('profileUrl')
            return <img src={API_IMAGE_URL + profileUrl} alt='profile' className='w-8 h-8 rounded-full' />
        },
    },
    {
        accessorKey: 'email',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Email' />
        ),
        cell: ({ row }) => <div className='w-fit text-nowrap'>{row.getValue('email')}</div>,
    },
    {
        accessorKey: 'roles',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Roles' />
        ),
        cell: ({ row }) => {
            const { roles } = row.original
            return (
                <div className='w-fit'>
                    {roles?.map((role) => (
                        <Badge key={role.id} className='mr-1'>
                            {role.name}
                        </Badge>
                    ))}
                </div>
            )
        },
    },
    {
        accessorKey: 'createdAt',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Created At' />
        ),
        cell: ({ row }) => <div className='w-fit text-nowrap'>{row.getValue('createdAt')}</div>,
    },
    {
        accessorKey: 'updatedAt',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Updated At' />
        ),
        cell: ({ row }) => <div className='w-fit text-nowrap'>{row.getValue('updatedAt')}</div>,
    },
    {
        id: 'actions',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Actions' />
        ),
        cell: DataTableRowActions,
    },
]