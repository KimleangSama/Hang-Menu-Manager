export interface OrderResponse {
    id: string;
    storeId: string;
    phoneNumber: string;
    totalAmountInRiel: number;
    totalAmountInDollar: number;
    status: string;
    orderTime: string;
    specialInstructions: string;
    orderMenus: OrderMenuResponse[];
}

export interface OrderListResponse {
    id: string;
    storeId: string;
    phoneNumber: string;
    totalAmountInRiel: number;
    totalAmountInDollar: number;
    status: string;
    orderTime: string;
    specialInstructions: string;
}

export interface OrderMenuResponse {
    id: string;
    menuId: string;
    menuName: string;
    menuImage: string;
    price: number;
    discount: number;
    quantity: number;
    currency: string;
    totalAmount: number;
    specialRequests: string;
}

