// components/IdleHandler.tsx
"use client";
import { useAuth } from "@/hooks/use-auth";
import useIdleTimer from "@/hooks/use-idle-timer";

const AUTO_LOGOUT_TIME = 1000 * 60 * 20; // 20 minutes

export default function IdleHandler() {
    const { logout } = useAuth();
    useIdleTimer({
        timeout: AUTO_LOGOUT_TIME, onTimeout: () => {
            console.log("User is idle for too long. Logging out...");
            logout();
            if (typeof window !== "undefined") {
                window.location.reload();
            }
        }
    });
    return null;
}
