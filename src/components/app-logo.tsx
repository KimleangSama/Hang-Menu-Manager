import { useAuth } from "@/hooks/use-auth"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

export default function AppLogo() {
    const {
        user
    } = useAuth()
    return (
        <div className="flex items-center justify-center h-12 w-full">
            <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user?.profileUrl} alt={user?.username} />
                <AvatarFallback>
                    <img src={`https://ui-avatars.com/api/?name=${user?.username}&color=0078D4&rounded=true`} alt={user?.username} />
                </AvatarFallback>
            </Avatar>
        </div>
    )
}