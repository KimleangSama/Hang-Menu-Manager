"use client";;
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/shared/table/data-table-column-header'
import { API_IMAGE_URL } from '@/constants/auth'
import { MenuResponse } from '../../types/menu-response'
import { DataTableRowActions } from './menu-row-action'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'
import Image from 'next/image'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { SheetTitle } from '../ui/sheet'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { CategoryResponse } from '@/types/category-response';
import { menuService } from '@/services/menu-service';
import { useStoreResponse } from '@/hooks/use-store';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';

const handleCategoryChange = async (menuId: string | undefined, store: string, categoryId: string) => {
    try {
        const res = await menuService.updateMenuCategory(menuId, store, categoryId);
        if (res.success) {
            toast.success('Category updated successfully');
        } else {
            toast.error('Failed to update category');
        }
    } catch (error) {
        console.error('Failed to update category:', error);
    }
}

export const menuColumns = (categories: CategoryResponse[]): ColumnDef<MenuResponse>[] => [
    {
        accessorKey: 'image',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Image' />
        ),
        cell: ({ row }) => {
            const { image, name } = row.original
            if (!image) return (<img src={`https://ui-avatars.com/api/?name=` + name} alt='Menu Image' className='rounded w-8 h-8' />)
            return (
                <Dialog>
                    <DialogTrigger asChild>
                        <div className='flex items-center justify-start cursor-pointer'>
                            <Image
                                src={API_IMAGE_URL + image}
                                alt='Menu Image'
                                width={32}
                                height={32}
                                loading='lazy'
                                onError={(e) => {
                                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${name}`
                                }}
                            />
                        </div>
                    </DialogTrigger>
                    <DialogContent className=''>
                        <VisuallyHidden>
                            <SheetTitle>
                                Menu
                            </SheetTitle>
                        </VisuallyHidden>
                        <div className='flex items-center justify-center'>
                            <Image
                                src={API_IMAGE_URL + image}
                                alt='Menu Image'
                                width={400}
                                height={400}
                                loading='lazy'
                                onError={(e) => {
                                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${name}`
                                }}
                            />
                        </div>
                    </DialogContent>
                </Dialog>
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
        cell: ({ row }) => <div className='w-44 text-wrap'>{row.getValue('description')}</div>,
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
        cell: ({ row }) => {
            const { user } = useAuth();
            const store = useStoreResponse(state => state.store)
            const { categoryId } = row.original;
            const disabled = user?.roles?.some(role => role.name === 'admin')
                || user?.roles?.some(role => role.name === 'manager')
                || user?.roles?.some(role => role.name === 'staff');
            return (
                <Select
                    disabled={disabled}
                    defaultValue={categoryId}
                    onValueChange={(value) => {
                        if (!store) return;
                        handleCategoryChange(row.original.id, store?.id, value);
                    }}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            );
        },
    },
    {
        accessorKey: 'Visible',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Visible' />
        ),
        cell: ({ row }) => {
            const { hidden } = row.original;
            return (
                <Badge color={hidden ? 'red' : 'green'}>
                    {hidden ? 'Hidden' : 'Visible'}
                </Badge>
            )
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