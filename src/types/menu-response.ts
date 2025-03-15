export interface MenuResponse {
    id: string
    code: string
    name: string
    description: string
    price: number
    discount: number
    currency: string
    image: string
    badges: string[]
    categoryId: string
    categoryName: string
    hidden: boolean
    favorite: boolean
    createdAt: string
    updatedAt: string
    images: MenuImageResponse[]
}

export interface MenuImageResponse {
    id: string
    name: string
    url: string
}