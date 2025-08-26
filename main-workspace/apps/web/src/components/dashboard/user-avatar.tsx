import type { User } from "better-auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "../../lib/utils";

type UserAvatarProps = {
    className?: string;
    user: User;
};

const UserAvatar = ({ className, user }: UserAvatarProps) => (
    <Avatar className={cn(className)}>
        <AvatarImage src={user.image!} />
        <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
    </Avatar>
);
export default UserAvatar;
