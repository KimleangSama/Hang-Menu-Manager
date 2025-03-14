import {
    ChartBarStacked,
    ListStart,
    MenuSquare,
    MessageSquareDot,
    PieChart,
    Store,
    UsersIcon,
} from "lucide-react"

/* eslint-disable  @typescript-eslint/no-explicit-any */
export interface SideNav {
    title: string
    url: string
    icon?: any
    isActive?: boolean
    items?: SideNav[]
}

export const coreSideNav: SideNav[] = [
    {
        title: "Dashboard",
        url: "#",
        icon: PieChart,
        isActive: true,
        items: [
            {
                title: "Overview",
                url: "/dashboard/overview",
            },
        ],
    },
    {
        title: "Store",
        url: "#",
        icon: Store,
        isActive: true,
        items: [
            {
                title: "Info",
                url: "/dashboard/stores/info",
            },
            {
                title: "Edit",
                url: "/dashboard/stores/edit",
            },
            {
                title: "Layout",
                url: "/dashboard/stores/layout",
            },
            {
                title: "Banner",
                url: "/dashboard/stores/banner",
            },
            {
                title: "Promotion",
                url: "/dashboard/stores/promotion",
            },
        ],
    },
    {
        title: "Menu",
        url: "/dashboard/menus",
        icon: MenuSquare,
        isActive: true,
        items: [
            {
                title: "Create",
                url: "/dashboard/menus/create",
            },
            // {
            //     title: "Batch",
            //     url: "/dashboard/menus/batch",
            // },
            {
                title: "List",
                url: "/dashboard/menus/list",
            },
        ],
    },
    {
        title: "Category",
        url: "/dashboard/categories",
        icon: ChartBarStacked,
        isActive: true,
        items: [
            {
                title: "Create",
                url: "/dashboard/categories/create",
            },
            {
                title: "List",
                url: "/dashboard/categories/list",
            },
        ],
    },
]


export const staffSideNav: SideNav[] = [
    {
        title: "Staff",
        url: "/users",
        icon: UsersIcon,
        isActive: true,
        items: [
            {
                title: "List",
                url: "/dashboard/staffs/list",
            },
        ],
    },
    {
        title: "Feedback",
        url: "/dashboard/feedbacks",
        icon: MessageSquareDot,
    },
]

export const orderSideNav: SideNav[] = [
    {
        title: "Orders",
        url: "/dashboard/orders/list",
        icon: ListStart,
        isActive: false
    },
]