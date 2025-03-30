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
    roles: string[]
    isActive?: boolean
    items?: SideNav[]
}

export const coreSideNav: SideNav[] = [
    {
        title: "Dashboard",
        url: "#",
        icon: PieChart,
        isActive: true,
        roles: ["manager", "staff", "cashier"],
        items: [
            {
                title: "Overview",
                url: "/dashboard/overview",
                roles: ["manager", "staff", "cashier"],
            },
        ],
    },
    {
        title: "Store",
        url: "#",
        icon: Store,
        isActive: true,
        roles: ["manager", "staff", "cashier", "customer", "delivery"],
        items: [
            {
                title: "Info",
                url: "/dashboard/stores/info",
                roles: ["manager", "staff", "cashier", "customer", "delivery"],
            },
            {
                title: "Edit",
                url: "/dashboard/stores/edit",
                roles: ["manager"],
            },
            {
                title: "Layout",
                url: "/dashboard/stores/layout",
                roles: ["manager", "staff"],
            },
            {
                title: "Banner",
                url: "/dashboard/stores/banner",
                roles: ["manager", "staff"],
            },
            {
                title: "Promotion",
                url: "/dashboard/stores/promotion",
                roles: ["manager", "staff"],
            },
        ],
    },
    {
        title: "Menu",
        url: "/dashboard/menus",
        icon: MenuSquare,
        isActive: true,
        roles: ["manager", "staff", "cashier"],
        items: [
            {
                title: "Create",
                url: "/dashboard/menus/create",
                roles: ["manager"],
            },
            // {
            //     title: "Batch",
            //     url: "/dashboard/menus/batch",
            // },
            {
                title: "List",
                url: "/dashboard/menus/list",
                roles: ["manager", "staff", "cashier"],
            },
        ],
    },
    {
        title: "Category",
        url: "/dashboard/categories",
        icon: ChartBarStacked,
        isActive: true,
        roles: ["manager", "staff", "cashier"],
        items: [
            {
                title: "Create",
                url: "/dashboard/categories/create",
                roles: ["manager"],
            },
            {
                title: "List",
                url: "/dashboard/categories/list",
                roles: ["manager", "staff", "cashier"],
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
        roles: ["manager", "staff"],
        items: [
            {
                title: "List",
                url: "/dashboard/staffs/list",
                roles: ["manager", "staff"],
            },
        ],
    },
    {
        title: "Feedback",
        url: "/dashboard/feedbacks",
        icon: MessageSquareDot,
        isActive: false,
        roles: ["manager", "staff", "cashier"],
    },
]

export const orderSideNav: SideNav[] = [
    {
        title: "Orders",
        url: "/dashboard/orders/list",
        icon: ListStart,
        roles: ["manager", "staff", "cashier", "delivery"],
        isActive: false
    },
]