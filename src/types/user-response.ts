export interface UserResponse {
    id: string
    username: string
    profileUrl: string
    email: string
    createdAt: string
    updatedAt: string
    roles: RoleResponse[]
}

export interface RoleResponse {
    id: string
    name: string
}