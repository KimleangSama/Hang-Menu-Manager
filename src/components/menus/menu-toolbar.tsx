import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { uniq } from 'lodash';
import { DataTableFacetedFilter } from '@/components/shared/table/data-table-faceted-filter'
import { DataTableViewOptions } from '@/components/shared/table/data-table-view-options'

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
                    placeholder='Filter tasks...'
                    value={
                        (table.getColumn('name')?.getFilterValue() as string) ?? ''
                    }
                    onChange={(event) =>
                        table.getColumn('name')?.setFilterValue(event.target.value)
                    }
                    className='h-8 w-[150px] lg:w-[250px]'
                />
                {/* <div className='flex gap-x-2'>
                    {table.getColumn('spicyLevel') && (
                        <DataTableFacetedFilter
                            column={table.getColumn('spicyLevel')}
                            title='Spicy Level'
                            options={[
                                { value: 'not_at_all', label: 'Not at all' },
                                { value: 'mild', label: 'Mild' },
                                { value: 'medium', label: 'Medium' },
                                { value: 'spicy', label: 'Spicy' },
                                { value: 'very_spicy', label: 'Very Spicy' },
                                { value: 'extremely', label: 'Extremely' },
                                { value: 'burn_your_body', label: 'Burn your body' },
                            ]}
                        />
                    )}
                </div> */}
                <div className='flex gap-x-2'>
                    {table.getColumn('categoryName') && (
                        <DataTableFacetedFilter
                            column={table.getColumn('categoryName')}
                            title='Category Name'
                            options={[
                                ...uniq(
                                    table.getPreFilteredRowModel().rows.map(row => row.getValue('categoryName'))
                                ).map(category => ({
                                    value: category as string,
                                    label: category as string
                                }))
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