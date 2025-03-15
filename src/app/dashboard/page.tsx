"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const DashboardPage = () => {
    const router = useRouter();

    useEffect(() => {
        router.push('/dashboard/overview');
    }, [router]); // Runs only once after the component mounts

    return <div></div>;
};

export default DashboardPage;
