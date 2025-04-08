import { useAuth } from "@/hooks/use-auth"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { API_IMAGE_URL } from "@/constants/auth"

export default function AppLogo() {
    const {
        user
    } = useAuth()
    return (
        <div className="flex items-center justify-center h-12 w-full">
            {user?.profileUrl && (
                <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={API_IMAGE_URL + user?.profileUrl} alt={user?.username} />
                    <AvatarFallback>
                        <img src={`https://ui-avatars.com/api/?name=${user?.username}&color=0078D4&rounded=true`} alt={user?.username} />
                    </AvatarFallback>
                </Avatar>
            )}
        </div>
    )
}