import { IconDiscountCheck } from "@tabler/icons-react";
import { CheckCircle, HeartIcon, XCircle } from "lucide-react";

export const BADGES = [
    {
        id: 1,
        name: 'In Stock',
        description: 'This item is in stock',
        color: 'green',
        icon: CheckCircle,
    },
    {
        id: 2,
        name: 'Out of Stock',
        description: 'This item is out of stock',
        color: 'red',
        icon: XCircle,
    },
    {
        id: 3,
        name: 'Discount',
        description: 'This item is on discount',
        color: 'blue',
        icon: IconDiscountCheck,
    },
    {
        id: 4,
        name: 'New Arrival',
        description: 'This item is a new arrival',
        color: 'purple',
        icon: CheckCircle,
    },
    {
        id: 5,
        name: 'Best Seller',
        description: 'This item is a best seller',
        color: 'orange',
        icon: HeartIcon,
    },
    {
        id: 6,
        name: 'Recommended',
        description: 'This item is recommended',
        color: 'Crimson',
        icon: CheckCircle,
    },
]