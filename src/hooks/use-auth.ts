import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ACCESS_TOKEN, API_BASE_URL } from '@/constants/auth'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'

interface User {
    id: string
    username: string
    profileUrl: string
    email: string
    roles: string[]
    createdAt: string
    updatedAt: string
}

interface AuthState {
    accessToken: string | null
    setAccessToken: (token: string | null) => Promise<void>
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean
    login: (username: string, password: string) => Promise<void>
    signup: (username: string, password: string, roles: string[]) => Promise<void>
    logout: () => void
    fetchUserInfo: (accessToken: string) => Promise<void>
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            accessToken: null,
            user: null,
            isLoading: false,
            isAuthenticated: false,

            login: async (username, password) => {
                set({ isLoading: true })
                try {
                    const { data } = await axios.post(`${API_BASE_URL}/auth/login-backoffice`, { username, password })
                    if (data?.success) {
                        set({ accessToken: data.payload.accessToken, isAuthenticated: true, isLoading: false })
                        await get().fetchUserInfo(data.payload.accessToken)
                        return data;
                    } else {
                        set({ isLoading: false })
                        console.error(data)
                        throw new Error(data?.error)
                    }
                } catch (error) {
                    set({ isLoading: false })
                    throw error
                }
            },

            signup: async (username, password, roles) => {
                set({ isLoading: true })
                try {
                    const { data } = await axios.post(`${API_BASE_URL}/auth/register-backoffice`, {
                        username, password, roles
                    })
                    set({ isLoading: false })
                    return data
                } catch (error) {
                    set({ isLoading: false })
                    throw error
                }
            },

            logout: () => {
                set({
                    accessToken: null,
                    user: null,
                    isAuthenticated: false,
                })
            },

            setAccessToken: async (token) => {
                set({ accessToken: token, isAuthenticated: !!token })
                if (token) await get().fetchUserInfo(token)
            },

            fetchUserInfo: async (accessToken: string) => {
                set({ isLoading: true })
                if (accessToken === null) {
                    set({ user: null, isAuthenticated: false })
                }
                try {
                    const { data } = await axios.get(API_BASE_URL + '/auth/me', {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    })
                    set({ user: data.payload, isAuthenticated: true, isLoading: false })
                } catch (error) {
                    get().logout()
                    throw error
                }
            },
        }),
        {
            name: ACCESS_TOKEN,
            partialize: (state) => ({ accessToken: state.accessToken }),
        }
    )
)

export const useAuth = ({ requiredAuth }: { requiredAuth?: boolean } = { requiredAuth: true }) => {
    const router = useRouter()
    const {
        isAuthenticated,
        isLoading,
        user,
        accessToken,
        setAccessToken,
        signup,
        login,
        logout,
        fetchUserInfo
    } = useAuthStore()

    useEffect(() => {
        // If we have a token but no user info, fetch it
        if (accessToken && !user) {
            fetchUserInfo(accessToken)
        }
        // Handle authentication requirements
        const authStorage = localStorage.getItem(ACCESS_TOKEN)
        if (requiredAuth && !isLoading && !isAuthenticated && !authStorage) {
            router.push('/auth/login')
        }
    }, [isAuthenticated, isLoading, router, requiredAuth, accessToken, user, fetchUserInfo])

    return {
        isAuthenticated,
        isLoading,
        user,
        accessToken,
        setAccessToken,
        login,
        signup,
        logout,
        fetchUserInfo
    }
}