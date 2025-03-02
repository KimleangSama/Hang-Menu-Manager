"use client";

import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import DashboardPage from '../../../layout';
import { toast } from 'sonner';

import { useParams } from 'next/navigation';
import { OrderResponse } from '@/types/order-response';
import { orderService } from '@/services/order-service';
import { getCurrencyLabel, getNAIfNull, getStatusLabel } from '@/lib/utils';

const ViewPage = () => {
    const params = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [orderResponse, setOrderResponse] = useState<OrderResponse>();

    useEffect(() => {
        async function fetchTable() {
            const response = await orderService.getOrderResponseById(params.id);
            console.log(response)
            if (response.success) {
                setOrderResponse(response.payload);
            } else {
                toast.error(response.error);
            }
            setLoading(false);
        }
        fetchTable();
    }, []);

    if (loading) {
        return (
            <DashboardPage>
                <Card>
                    <p>Loading...</p>
                </Card>
            </DashboardPage>
        );
    }

    return (
        <DashboardPage>
            <div className='mx-auto max-w-6xl grid gap-4'>
                <div className="p-4 space-y-6">
                    <div className="sticky top-1 z-10 flex justify-between items-center">
                        <h1 className="text-3xl font-bold">Order Menu Details</h1>
                    </div>
                    <div className="grid grid-cols-2 gap-4 px-4">
                        <div>
                            <p className="font-medium text-lg">Phone Number: {getNAIfNull(orderResponse?.phoneNumber)}</p>
                        </div>
                        <div>
                            <p className="font-medium text-lg">Order Time: {getNAIfNull(orderResponse?.orderTime)}</p>
                        </div>
                        <div>
                            <p className="font-medium text-lg">User Instructions: {getNAIfNull(orderResponse?.specialInstructions)}</p>
                        </div>
                        <div>
                            <p className="font-medium text-lg">Status: {getStatusLabel(orderResponse?.status)}</p>
                        </div>
                        <div>
                            <p className="font-medium text-lg">Total in Dollar: {getNAIfNull("$" + orderResponse?.totalAmountInDollar)}</p>
                        </div>
                        <div>
                            <p className="font-medium text-lg">Total in Riel: {getNAIfNull("R" + orderResponse?.totalAmountInRiel)}</p>
                        </div>
                    </div>
                    <div className="grid gap-4 px-4">
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">Menu Name</th>
                                    <th className="border border-gray-300 px-4 py-2">Quantity</th>
                                    <th className="border border-gray-300 px-4 py-2">Price</th>
                                    <th className="border border-gray-300 px-4 py-2">Discount</th>
                                    <th className="border border-gray-300 px-4 py-2">Total Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderResponse?.orderMenus?.map((orderItem, index) => (
                                    <tr key={index}>
                                        <td className="border border-gray-300 px-4 py-2">{orderItem.menuName}</td>
                                        <td className="border border-gray-300 px-4 py-2">{orderItem.quantity}</td>
                                        <td className="border border-gray-300 px-4 py-2">{getCurrencyLabel(orderItem.currency)}{orderItem.price}</td>
                                        <td className="border border-gray-300 px-4 py-2">{getCurrencyLabel(orderItem.currency)}{orderItem.discount}</td>
                                        <td className="border border-gray-300 px-4 py-2">{getCurrencyLabel(orderItem.currency)}{orderItem.totalAmount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardPage>
    );
};

export default ViewPage;
