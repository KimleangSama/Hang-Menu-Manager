"use client";

import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import DashboardPage from '../../../layout';
import { menuService } from '@/services/menu-service';
import { toast } from 'sonner';

import { useParams } from 'next/navigation';
import { MenuResponse } from '../../../../../types/menu-response';
import { API_BASE_URL } from '@/constants/auth';

const ViewPage = () => {
    const params = useParams<{ id: string }>();
    const [menuResponse, setMenuResponse] = useState<MenuResponse>();

    useEffect(() => {
        async function fetchTable() {
            const response = await menuService.getMenuById(params.id);
            if (response.success) {
                setMenuResponse(response.payload);
            } else {
                toast.error(response.error);
            }
        }
        fetchTable();
    }, []);

    if (!menuResponse) {
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
            <div className='mx-auto max-w-6xl grid grid-cols-2 gap-4'>
                <div className="p-4 space-y-6">
                    <div className="sticky top-1 z-10 flex justify-between items-center backdrop:blur-sm">
                        <h1 className="text-3xl font-bold">Menu Details</h1>
                    </div>
                    <div className="grid grid-cols-2 gap-4 px-4">
                        <div>
                            <p className="font-medium text-lg">Code:</p>
                            <p>{menuResponse.code}</p>
                        </div>
                        <div>
                            <p className="font-medium text-lg">Name:</p>
                            <p>{menuResponse.name}</p>
                        </div>
                        <div>
                            <p className="font-medium text-lg">Description:</p>
                            <p>{menuResponse.description}</p>
                        </div>
                        <div>
                            <p className="font-medium text-lg">Price:</p>
                            <p>
                                {menuResponse.currency === 'dollar' ? 'USD ' : 'KHR '}
                                {typeof menuResponse.price === 'number' && !isNaN(menuResponse.price)
                                    ? menuResponse.price.toFixed(2)
                                    : menuResponse.price}
                            </p>
                        </div>
                        <div>
                            <p className="font-medium text-lg">Discount:</p>
                            <p>
                                {menuResponse.currency === 'dollar' ? 'USD ' : 'KHR '}
                                {typeof menuResponse.discount === 'number' && !isNaN(menuResponse.discount)
                                    ? menuResponse.discount.toFixed(2)
                                    : menuResponse.discount}
                            </p>
                        </div>
                        <div>
                            <p className="font-medium text-lg">Category:</p>
                            <p>{menuResponse.categoryName}</p>
                        </div>
                        <div className='col-span-2'>
                            <p className="font-medium text-lg">Image:</p>
                            <div className='flex items-center justify-center'>
                                <img loading='lazy' src={API_BASE_URL + "/files/view/" + menuResponse.image} width={"100%"} alt='Menu Image' onError={(e) => {
                                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${menuResponse.name}`
                                }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardPage>
    );
};

export default ViewPage;
