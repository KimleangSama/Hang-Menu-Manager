import {
    AudioWaveform,
    BookOpen,
    Bot,
    ChartBarStacked,
    Command,
    Frame,
    GalleryVerticalEnd,
    ListStart,
    Map,
    MenuSquare,
    MessageSquareDot,
    PieChart,
    Settings2,
    SquareTerminal,
    Store,
    Table,
    UsersIcon,
    UtensilsCrossed,
} from "lucide-react"

export interface SideNav {
    title: string
    url: string
    icon?: any
    isActive?: boolean
    items?: SideNav[]
}

export const accountSideNav = {
    name: "John Doe",
    email: "",
    avatar: "https://ui-avatars.com/api/?size=128",
}

export const coreSideNav: SideNav[] = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: PieChart,
        isActive: false,
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
                title: "Update",
                url: "/dashboard/stores/update",
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
        url: "/dashboard/tables",
        icon: MessageSquareDot,
    },
]

export const orderSideNav: SideNav[] = [
    {
        title: "Orders",
        url: "#",
        icon: ListStart,
        isActive: true,
        items: [
            {
                title: "List",
                url: "/dashboard/orders/list",
            },
            {
                title: "History",
                url: "/dashboard/orders/history",
            },
        ],
    },
]