"use client";

import { useStoreResponse } from "@/hooks/use-store";
import { storeService } from "@/services/store-service";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";

const LayoutPage = () => {
    const store = useStoreResponse((state) => state.store);
    const updateStore = useStoreResponse((state) => state.setStore);
    const [selectedLayout, setSelectedLayout] = useState(store?.layout || 'default');

    useEffect(() => {
        if (!store) return;
        setSelectedLayout(store.layout);
    }, [store?.layout]);

    if (!store) return

    const handleLayoutChanged = async (layout: string) => {
        if (!layout || layout === store.layout) return;
        setSelectedLayout(layout);
        const updatedStore = { ...store, layout };
        updateStore(updatedStore);
        const res = await storeService.updateStoreLayout(store.slug, layout);
        if (res.success) {
            toast.success('Layout updated successfully');
        } else {
            updateStore(store);
            setSelectedLayout(store.layout);
            toast.error('Failed to update layout ' + res.error);
        }
    }

    const layoutOptions = [
        {
            id: 'default',
            name: 'Grid Display',
            description: 'Products displayed in a grid format, ideal for visual browsing.'
        },
        {
            id: 'table',
            name: 'Table Display',
            description: 'Products in a compact list view, great for comparing many items.'
        },
        {
            id: 'tableXL',
            name: 'Table XL Display',
            description: 'Expanded list view with larger images and more product details.'
        }
    ];

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8">
            <div className="border-b pb-4">
                <h1 className="text-3xl font-bold">Store Layout</h1>
                <p className="text-gray-500 mt-2">Choose how products are displayed in your store</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {layoutOptions.map((option) => (
                    <div
                        key={option.id}
                        className={`border-2 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md ${selectedLayout === option.id ? 'ring-2 ring-offset-2' : ''}`}
                        style={{
                            borderColor: selectedLayout === option.id ? store.color : 'transparent',
                            outlineColor: store.color
                        }}
                    >
                        <div className="relative">
                            {/* Layout preview */}
                            <LayoutPreview
                                type={option.id}
                                storeColor={store.color}
                            />

                            {/* Selection indicator */}
                            {selectedLayout === option.id && (
                                <div className="absolute top-2 right-2 bg-white rounded-full shadow-lg p-1">
                                    <CheckCircle size={24} color={store.color} fill={store.color} fillOpacity={0.2} />
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-white">
                            <h3 className="font-bold text-lg">{option.name}</h3>
                            <p className="text-gray-600 text-sm mt-1">{option.description}</p>

                            <button
                                onClick={() => handleLayoutChanged(option.id)}
                                disabled={selectedLayout === option.id}
                                className={`mt-4 w-full py-2 px-4 rounded-lg font-medium transition-colors ${selectedLayout === option.id
                                    ? 'bg-gray-100 text-gray-500 cursor-default'
                                    : `bg-white hover:bg-gray-50 text-gray-900 border border-gray-300`
                                    }`}
                            >
                                {selectedLayout === option.id ? 'Current Layout' : 'Select Layout'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Component to render different layout previews
interface LayoutPreviewProps {
    type: string;
    storeColor: string;
}

const LayoutPreview = ({ type, storeColor }: LayoutPreviewProps) => {
    switch (type) {
        case 'default':
            return (
                <div className="bg-gray-50 p-4">
                    <div className="p-2 flex justify-between items-center" style={{ backgroundColor: storeColor }}>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-white rounded-full"></div>
                            <div className="h-4 w-10 bg-white bg-opacity-80 rounded"></div>
                        </div>
                        <div className="flex gap-2">
                            <div className="h-4 w-8 bg-white bg-opacity-80 rounded"></div>
                            <div className="h-4 w-12 bg-white bg-opacity-80 rounded"></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 p-2">
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <div key={item} className="border bg-white rounded-lg p-2 relative">
                                <div className="w-full h-16 bg-gray-200 rounded-lg mx-auto"></div>
                                <div className="mt-2 space-y-1">
                                    <div className="h-3 w-full bg-gray-200 rounded"></div>
                                    <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        case 'table':
            return (
                <div className="bg-gray-50 p-4">
                    <div className="p-2 flex justify-between items-center" style={{ backgroundColor: storeColor }}>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-white rounded-full"></div>
                            <div className="h-4 w-10 bg-white bg-opacity-80 rounded"></div>
                        </div>
                        <div className="flex gap-2">
                            <div className="h-4 w-8 bg-white bg-opacity-80 rounded"></div>
                            <div className="h-4 w-12 bg-white bg-opacity-80 rounded"></div>
                        </div>
                    </div>
                    {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="p-3 border-b bg-white flex justify-between items-center">
                            <div className="flex gap-3">
                                <div className="w-16 h-16 bg-gray-200 rounded"></div>
                                <div className="flex flex-col gap-1">
                                    <div className="h-3 w-12 bg-gray-200 rounded"></div>
                                    <div className="h-4 w-24 bg-gray-300 rounded"></div>
                                </div>
                            </div>
                            <div className="h-4 w-12 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
            );
        case 'tableXL':
            return (
                <div className="bg-gray-50 p-4">
                    <div className="p-2 flex justify-between items-center" style={{ backgroundColor: storeColor }}>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-white rounded-full"></div>
                            <div className="h-4 w-10 bg-white bg-opacity-80 rounded"></div>
                        </div>
                        <div className="flex gap-2">
                            <div className="h-4 w-8 bg-white bg-opacity-80 rounded"></div>
                            <div className="h-4 w-12 bg-white bg-opacity-80 rounded"></div>
                        </div>
                    </div>
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="p-3 border-b bg-white flex gap-4">
                            <div className="w-1/3">
                                <div className="h-24 w-full bg-gray-200 rounded"></div>
                            </div>
                            <div className="w-2/3 space-y-2">
                                <div className="h-4 w-32 bg-gray-300 rounded"></div>
                                <div className="h-3 w-24 bg-gray-200 rounded"></div>
                                <div className="flex flex-col gap-1 mt-2">
                                    <div className="h-2 w-full bg-gray-200 rounded"></div>
                                    <div className="h-2 w-full bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            );
        default:
            return null;
    }
};

export default LayoutPage;