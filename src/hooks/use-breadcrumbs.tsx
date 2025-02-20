import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

type BreadcrumbItem = {
    title: string;
    link: string;
};

// This allows to add custom title as well
const routeMapping: Record<string, BreadcrumbItem[]> = {
    '/dashboard': [{ title: 'Dashboard', link: '/dashboard' }],
    '/property': [
        { title: 'Property', link: '/property' },
        { title: 'Add', link: '/property/add' },
        { title: 'List', link: '/property/list' }
    ],
    // Add more custom mappings as needed
};
function formatString(input: string) {
    return input
        .split('-') // Split the string by hyphen
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
        .join('-'); // Join them back with a hyphen
}
export function useBreadcrumbs() {
    const pathname = usePathname();
    const breadcrumbs = useMemo(() => {
        // Check if we have a custom mapping for this exact path
        if (routeMapping[pathname]) {
            return routeMapping[pathname];
        }

        // If no exact match, fall back to generating breadcrumbs from the path
        const segments = pathname.split('/').filter(Boolean);
        return segments.map((segment, index) => {
            const path = `/${segments.slice(0, index + 1).join('/')}`;
            return {
                title: formatString(segment),
                link: path
            };
        });
    }, [pathname]);
    return breadcrumbs;
}