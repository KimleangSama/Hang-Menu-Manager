"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IconCash } from '@tabler/icons-react';
import { DollarSignIcon, ListOrderedIcon, MenuIcon } from 'lucide-react';

export default function Overview() {
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
                                12,345
                            </div>
                            <p className='text-xs text-muted-foreground'>
                                +201 since last hour
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
                            <div className='text-2xl font-bold'>+2350</div>
                            <p className='text-xs text-muted-foreground'>
                                +201 since last hour
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
                            <div className='text-2xl font-bold'>+12,234</div>
                            <p className='text-xs text-muted-foreground'>
                                +201 since last hour
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
                            <div className='text-2xl font-bold'>+573</div>
                            <p className='text-xs text-muted-foreground'>
                                +201 since last hour
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
