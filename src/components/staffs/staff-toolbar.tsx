import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from '@/components/shared/table/data-table-view-options'
import { DataTableFacetedFilter } from '../shared/table/data-table-faceted-filter'

interface DataTableToolbarProps<TData> {
    table: Table<TData>
}

export function DataTableToolbar<TData>({
    table,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0
    return (
        <div className='flex items-center justify-between'>
            <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
                <Input
                    placeholder='Filter staffs...'
                    value={
                        (table.getColumn('fullname')?.getFilterValue() as string) ?? ''
                    }
                    onChange={(event) =>
                        table.getColumn('fullname')?.setFilterValue(event.target.value)
                    }
                    className='h-8 w-[150px] lg:w-[250px]'
                />
                <div className='flex gap-x-2'>
                    {table.getColumn('roles') && (
                        <DataTableFacetedFilter
                            column={table.getColumn('roles')}
                            title='Roles'
                            options={[
                                { value: 'admin', label: 'Admin' },
                            ]}
                        />
                    )}
                </div>
                {isFiltered && (
                    <Button
                        variant='ghost'
                        onClick={() => table.resetColumnFilters()}
                        className='h-8 px-2 lg:px-3'
                    >
                        Reset
                        <Cross2Icon className='ml-2 h-4 w-4' />
                    </Button>
                )}
            </div>
            <div className='space-x-2 flex items-center'>
                <DataTableViewOptions table={table} />
            </div>
        </div>
    )
}