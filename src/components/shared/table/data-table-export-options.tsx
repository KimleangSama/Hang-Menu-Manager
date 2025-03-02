import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

interface DataTableExportOptionsProps<TData> {
    table: Table<TData>
}

export function DataTableExportOptions<TData>({
    table,
}: DataTableExportOptionsProps<TData>) {
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant='outline'
                    size='sm'
                    className='ml-auto hidden h-8 lg:flex'
                    onClick={() => {
                        console.log(table.getFlatHeaders())
                        toast('Exporting as CSV...')
                    }}
                >
                    Export
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                <DropdownMenuLabel>
                    Export as
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className='capitalize cursor-pointer'
                    onClick={() => {
                        toast('Exporting as CSV...')
                    }}
                >
                    Excel
                </DropdownMenuItem>
                <DropdownMenuItem
                    className='capitalize cursor-pointer'
                    onClick={() => {
                        toast('Exporting as CSV...')
                    }}
                >
                    Pdf
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}