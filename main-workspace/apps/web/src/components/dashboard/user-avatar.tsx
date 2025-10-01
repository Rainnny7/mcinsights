import type { User } from "better-auth";
import { cn } from "../../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type UserAvatarProps = {
    className?: string;
    user?: User;
    avatar?: string;
};

const UserAvatar = ({ className, user, avatar }: UserAvatarProps) => {
    const avatarSrc: string = avatar || user?.image!;
    return (
        <Avatar className={cn(className)}>
            <AvatarImage
                src={avatarSrc}
                alt={`${user?.name || "User"} User Avatar`}
            />
            <AvatarFallback>{user?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
        </Avatar>
    );
};
export default UserAvatar;
