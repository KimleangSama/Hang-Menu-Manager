"use client";

import NoStore from '@/components/no-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStoreResponse } from '@/hooks/use-store';
import { dashboardService } from '@/services/dashboard-service';
import { OverviewResponse } from '@/types/overview-response';
import { IconCash } from '@tabler/icons-react';
import { DollarSignIcon, ListOrderedIcon, MenuIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function Overview() {
    const store = useStoreResponse(state => state.store);
    const [overview, setOverview] = useState<OverviewResponse | null>(null);

    useEffect(() => {
        async function fetchData() {
            if (store && store.id) {
                const response = await dashboardService.getDashboardOverview(store?.id);
                if (response.success) {
                    setOverview(response.payload);
                } else if (response.statusCode === 403 || response.statusCode === 401) {
                    // Handle unauthorized access
                    console.error('Unauthorized access to dashboard overview');
                    toast.error('You are not authorized to access this page');
                    setTimeout(() => {
                        window.location.href = '/auth/login';
                    }, 1500);
                }
            }
        }
        fetchData();
    }, [store]);

    if (!overview) return <NoStore />;

    return (
        <div className='max-w-full flex xl:flex-nowrap flex-wrap'>
            <div className="p-4 w-full space-y-6">
                <div className="sticky top-1 z-10 flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                </div>
                <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                    <Card>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium'>
                                Total Menus
                            </CardTitle>
                            <MenuIcon className='h-6 w-6 text-muted-foreground' />
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold'>
                                {overview.totalMenus}
                            </div>
                            <p className='text-xs text-muted-foreground'>
                                +{overview.totalMenus - overview.totalMenuLastWeek} since last week
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium'>
                                Total Orders
                            </CardTitle>
                            <ListOrderedIcon className='h-6 w-6 text-muted-foreground' />
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold'>
                                {overview.totalOrders}
                            </div>
                            <p className='text-xs text-muted-foreground'>
                                +{overview.totalOrders - overview.totalOrderLastWeek} since last week
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium'>
                                Total Revenue (USD)
                            </CardTitle>
                            <DollarSignIcon className='h-6 w-6 text-muted-foreground' />
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold'>
                                {overview.totalRevenueUsd ?? 0}
                            </div>
                            <p className='text-xs text-muted-foreground'>
                                +{overview.totalRevenueUsd - overview.totalRevenueUsdLastWeek} since last week
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium'>
                                Total Revenue (Riel)
                            </CardTitle>
                            <IconCash className='h-6 w-6 text-muted-foreground' />
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold'>
                                {overview.totalRevenueRiel ?? 0}
                            </div>
                            <p className='text-xs text-muted-foreground'>
                                +{overview.totalRevenueRiel - overview.totalRevenueRielLastWeek} since last week
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
