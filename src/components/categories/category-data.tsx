import { useMemo, useRef, useState } from 'react'
import {
    ColumnFiltersState,
    RowData,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { DataTablePagination } from '@/components/shared/table/data-table-pagination'
import { useVirtualizer } from '@tanstack/react-virtual'
import { ScrollArea } from '../ui/scroll-area'
import { ScrollAreaScrollbar } from '@radix-ui/react-scroll-area'
import { DataTableToolbar } from './category-toolbar'
import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, MouseSensor, TouchSensor, UniqueIdentifier, useSensor, useSensors } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { toast } from 'sonner'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CategoryResponse } from '@/types/category-response'
import { DraggableRow } from './category-dnd'
import { random } from 'lodash'
import { categoryService } from '@/services/category-service'
import { useStoreResponse } from '@/hooks/use-store'
import { CategoryPositionUpdate } from '@/types/request/category-request'

declare module '@tanstack/react-table' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface ColumnMeta<TData extends RowData, TValue> {
        className: string
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DataTable({ columns, data, setData }: any) {
    const store = useStoreResponse((state) => state.store)
    const [rowSelection, setRowSelection] = useState({})
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [sorting, setSorting] = useState<SortingState>([])

    const table = useReactTable<CategoryResponse>({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getRowId: (row) => row.id,
    })

    const { rows } = table.getRowModel()

    const parentRef = useRef<HTMLDivElement>(null)
    const virtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 34,
        overscan: 50,
    })

    const dataIds = useMemo<UniqueIdentifier[]>(
        () => data?.map((item: { id: UniqueIdentifier }) => item.id),
        [data]
    )

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (active && over && active.id !== over.id) {
            setData((data: CategoryResponse[]) => {
                const oldIndex = dataIds.indexOf(active.id)
                const newIndex = dataIds.indexOf(over.id)
                const newData = arrayMove(data, oldIndex, newIndex)
                const changedItems = extractChangedItems(newData);
                if (store !== null && changedItems.length > 0) {
                    categoryService.reorderCategories(store?.id, changedItems);
                }
                return newData
            })
        }
    }

    function extractChangedItems(newData: CategoryResponse[]) {
        const changedItems: CategoryPositionUpdate[] = [];
        newData.forEach((item, index) => {
            if (item.position !== index) { // Compare positions
                changedItems.push({ id: item.id, position: index });
            }
        });
        return changedItems;
    }

    const sensors = useSensors(
        useSensor(MouseSensor, {}),
        useSensor(TouchSensor, {}),
        useSensor(KeyboardSensor, {})
    )

    return (
        <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
        >
            <div className='space-y-4'>
                <DataTableToolbar table={table} />
                <div className='rounded-md border relative' ref={parentRef}>
                    <ScrollArea className='h-[calc(100dvh-282px)]'>
                        <Table>
                            <TableHeader className='sticky top-0 z-20 bg-white dark:bg-black'>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id} className='group/row'>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead
                                                    key={header.id}
                                                    colSpan={header.colSpan}
                                                    className={header.column.columnDef.meta?.className ?? ''}
                                                >
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                </TableHead>
                                            )
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                <SortableContext
                                    items={dataIds}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {rows?.length ? (
                                        virtualizer.getVirtualItems().map((virtualRow, index) => {
                                            const row = rows[virtualRow.index]
                                            if (!row) return null
                                            return (
                                                <DraggableRow
                                                    key={row.id}
                                                    index={index}
                                                    row={row}
                                                    virtualRow={virtualRow}
                                                />
                                            )
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={columns.length}
                                                className='h-24 text-center'
                                            >
                                                No results.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </SortableContext>
                            </TableBody>
                        </Table>
                        <ScrollAreaScrollbar orientation="horizontal" />
                    </ScrollArea>
                </div>
                <DataTablePagination table={table} />
            </div>
        </DndContext>
    )
}