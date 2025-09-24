import type { User } from "better-auth";
import { cn } from "../../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type UserAvatarProps = {
    className?: string;
    user: User;
};

const UserAvatar = ({ className, user }: UserAvatarProps) => (
    <Avatar className={cn(className)}>
        <AvatarImage src={user.image!} alt={`${user.name} User Avatar`} />
        <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
    </Avatar>
);
export default UserAvatar;
