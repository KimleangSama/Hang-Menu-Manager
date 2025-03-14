"use client";

import { feedbackColumns } from "@/components/feedbacks/feedback-column";
import { DataTable } from "@/components/feedbacks/feedback-data";
import { DataTableSkeleton } from "@/components/shared/table/data-table-skeleton";
import useDialogState from "@/hooks/use-dialog";
import { useStoreResponse } from "@/hooks/use-store";
import TableListContextProvider, { TableListDialogType } from "@/providers/table-list-provider";
import { feedbackService } from "@/services/feedback-service";
import { FeedbackResponse } from "@/types/feedback-response";
import { useEffect, useState } from "react";

const FeedbackPage = () => {
    const store = useStoreResponse(state => state.store);
    const [loading, setLoading] = useState(true)
    const [feedbacks, setFeedbacks] = useState<FeedbackResponse[]>([]);
    const [currentRow, setCurrentRow] = useState<FeedbackResponse | null>(null)
    const [open, setOpen] = useDialogState<TableListDialogType>(null)

    useEffect(() => {
        const fetchFeedbacks = async () => {
            if (store) {
                try {
                    const response = await feedbackService.getFeedbackByStoreId(store.id);
                    console.log(response.payload)
                    if (response.success) {
                        setFeedbacks(response.payload);
                    } else {
                        console.error(response.error)
                    }
                    setLoading(false);
                } catch (error) {
                    console.error(error)
                }
            }
        }
        fetchFeedbacks();
    }, [store])

    return (
        <div className="p-4 space-y-6">
            <div className="flex justify-between items-center sticky top-2 z-10 backdrop-blur-sm">
                <h1 className="text-3xl font-bold">List Feedbacks</h1>
            </div>
            <TableListContextProvider value={{ open, setOpen, currentRow, setCurrentRow }}>
                <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
                    {loading ? <DataTableSkeleton columnCount={7} rowCount={15} /> :
                        <DataTable data={feedbacks} columns={feedbackColumns} />
                    }
                </div>
            </TableListContextProvider>
        </div>
    )
}

export default FeedbackPage;