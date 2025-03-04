"use client";

import { Button } from "@/components/ui/button";
import DashboardPage from "../../layout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function BatchPage() {
    return (
        <>
            <div className='mx-auto max-w-6xl gap-4'>
                <div className="p-4 space-y-6">
                    <div className="sticky top-1 z-10 flex justify-between items-center w-full backdrop:blur-sm">
                        <h1 className="text-3xl font-bold">Batch Create Menu</h1>
                        <div>
                            <Button>
                                Download Template
                            </Button>
                        </div>
                    </div>
                    <Card>
                        <div className="p-4 space-y-5">
                            <div>
                                <h2 className="text-lg font-bold">Upload File</h2>
                                <p className="text-sm text-gray-500">Upload a CSV file to create multiple menu items at once.</p>
                            </div>
                            <div>
                                <Input
                                    type="file"
                                    accept=".csv"
                                />
                            </div>
                            <div>
                                <Button>
                                    Upload File
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </>
    )
}