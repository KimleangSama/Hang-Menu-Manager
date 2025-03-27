"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BellIcon, ShoppingCart } from "lucide-react";
import { useStoreResponse } from "@/hooks/use-store";
import { notificationService } from "@/services/notification-service";
import { toast } from "sonner";
import moment from "moment";
import { NotificationResponse } from "@/types/notification-response";

export default function NavNotification() {
    const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
    const store = useStoreResponse(state => state.store);
    const router = useRouter();

    useEffect(() => {
        if (!store) return;

        notificationService.findAllNotificationsByStoreId(store.id).then(response => {
            if (response.success) {
                setNotifications(response.payload);
            } else {
                toast.error(response.error);
            }
        });
    }, [store]);

    const updateNotificationStatus = useCallback((id: string, read: boolean) => {
        setNotifications(prev => prev.map(notif => notif.id === id ? { ...notif, read } : notif));
    }, []);

    const markAsReadAndNavigate = useCallback((notif: NotificationResponse) => {
        if (!store?.id) return;

        updateNotificationStatus(notif.id, true);

        notificationService.markAsRead(store.id, notif.id).then(response => {
            if (!response.success) {
                updateNotificationStatus(notif.id, false);
                toast.error(response.error);
            }
        });

        if (notif.link) router.push(`/dashboard/${notif.link}/view`);
    }, [store, router, updateNotificationStatus]);

    const markAllAsRead = useCallback(() => {
        setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    }, []);

    const clearNotifications = useCallback(() => {
        if (!store?.id || !confirm("Are you sure you want to clear all notifications?")) return;

        notificationService.deleteAllByStoreId(store.id).then(response => {
            if (response.success) {
                setNotifications([]);
            } else {
                toast.error(response.error);
            }
        });
    }, [store]);

    const unreadCount = notifications.filter(notif => !notif.read).length;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative rounded-full">
                    <BellIcon className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge className="absolute -top-2 -right-2 rounded-full bg-red-500 text-white px-2 py-0.5 text-xs font-medium">
                            {unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-2">
                <DropdownMenuLabel className="mb-2 text-lg font-medium">Notifications</DropdownMenuLabel>
                <div className="flex justify-between px-2">
                    <Button variant="ghost" size="sm" onClick={markAllAsRead} disabled={!unreadCount}>
                        Mark All as Read
                    </Button>
                    <Button variant="ghost" size="sm" onClick={clearNotifications} disabled={!notifications.length}>
                        Clear All
                    </Button>
                </div>
                <DropdownMenuSeparator className="my-2" />
                <div className="px-2 max-h-80 overflow-y-auto space-y-4">
                    {notifications.length ? (
                        notifications.map(notif => (
                            <div
                                key={notif.id}
                                className="flex items-start gap-3 cursor-pointer"
                                onClick={() => markAsReadAndNavigate(notif)}
                            >
                                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${notif.read ? "bg-gray-400" : "bg-blue-500"} text-white`}>
                                    <ShoppingCart className="h-5 w-5" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className={`text-sm font-medium ${notif.read ? "text-gray-400" : ""}`}>
                                        {notif.message}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {moment(notif.time).fromNow()}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400">No notifications</p>
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
