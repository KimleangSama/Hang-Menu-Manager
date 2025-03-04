"use client";;
import { CategoryResponse } from '@/types/category-response';
import { useSortable } from '@dnd-kit/sortable';
import { flexRender, Row } from '@tanstack/react-table';
import { CSSProperties } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { ListEnd } from 'lucide-react';
import { TableCell, TableRow } from '../ui/table';
import { VirtualItem } from '@tanstack/react-virtual';

const RowDragHandleCell = ({ rowId }: { rowId: string }) => {
    const { attributes, listeners } = useSortable({
        id: rowId,
    })
    return (
        // Alternatively, you could set these attributes on the rows themselves
        <button {...attributes} {...listeners} className='w-full flex items-center justify-center'>
            <ListEnd size={24} />
        </button>
    )
}

const DraggableRow = ({ index, row, virtualRow }
    : {
        index: number,
        row: Row<CategoryResponse>,
        virtualRow: VirtualItem,
    }) => {
    const { transform, transition, setNodeRef, isDragging } = useSortable({
        id: row.original.id,
    })

    const style: CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition: transition,
        opacity: isDragging ? 0.8 : 1,
        zIndex: isDragging ? 1 : 0,
        position: 'relative',
        height: `${virtualRow.size}px`,
        // transform: `translateY(${virtualRow.start - index * virtualRow.size}px)`,
    }
    return (
        <TableRow
            ref={setNodeRef}
            key={row.id}
            data-state={row.getIsSelected() && 'selected'}
            className='group/row'
            style={style}
        >
            {row.getVisibleCells().map(cell => (
                <TableCell
                    key={cell.id}
                    className={cell.column.columnDef.meta?.className ?? ''}
                    style={{ width: cell.column.getSize() }}
                >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
            ))}
        </TableRow>
    )
}

export {
    RowDragHandleCell,
    DraggableRow,
}