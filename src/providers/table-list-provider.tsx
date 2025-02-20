import React from 'react'

export type TableListDialogType = 'view' | 'edit' | 'delete'

interface TableListContextType<TData> {
    open: TableListDialogType | null
    setOpen: (str: TableListDialogType | null) => void
    currentRow: TData | null
    setCurrentRow: React.Dispatch<React.SetStateAction<TData | null>>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TableListContext = React.createContext<TableListContextType<any> | null>(null)

interface Props<TData> {
    children: React.ReactNode
    value: TableListContextType<TData>
}

export default function TableListContextProvider<TData>({ children, value }: Props<TData>) {
    return <TableListContext.Provider value={value}> {children} </TableListContext.Provider>
}

export const useTableListContext = () => {
    const context = React.useContext(TableListContext)
    if (!context) {
        throw new Error(
            'useTableListContext has to be used within <TableListContext.Provider>'
        )
    }

    return context
}