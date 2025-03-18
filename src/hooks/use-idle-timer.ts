"use client";

import { useEffect, useRef } from "react";

interface UseIdleTimerProps {
    timeout: number; // In milliseconds
    onTimeout: () => void;
}

const useIdleTimer = ({ timeout, onTimeout }: UseIdleTimerProps) => {
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const resetTimer = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(onTimeout, timeout);
    };

    useEffect(() => {
        const events = ["mousemove", "keydown", "wheel", "touchstart"];

        const handleEvent = () => resetTimer();

        events.forEach((event) => window.addEventListener(event, handleEvent));

        resetTimer(); // Initialize the timer

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            events.forEach((event) => window.removeEventListener(event, handleEvent));
        };
    }, [timeout, onTimeout]);
};

export default useIdleTimer;
