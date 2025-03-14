import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/shared/table/data-table-column-header'
import LongText from '@/components/shared/text/long-text'
import { FeedbackResponse } from '@/types/feedback-response'
import StarRatingDisplay from './star-rating'

export const feedbackColumns: ColumnDef<FeedbackResponse>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Id" />
        ),
        cell: ({ row }) => {
            const { id } = row.original;
            const truncatedId = id?.length > 16 ? `${id.slice(0, 12)}....` : id;
            return <p className="w-24 truncate">{id}</p>;
        },
    },
    {
        accessorKey: 'comment',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Comment' />
        ),
        cell: ({ row }) => <LongText>{row.getValue('comment')}</LongText>,
    },
    {
        accessorKey: 'rating',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Rating' />
        ),
        cell: ({ row }) => (
            <div className='flex justify-start'>
                <StarRatingDisplay rating={row.getValue('rating')} />
            </div>
        ),
        enableSorting: false,
    }
]