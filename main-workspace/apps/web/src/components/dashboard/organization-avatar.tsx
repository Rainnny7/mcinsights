import type { Organization } from "better-auth/plugins/organization";
import { cn } from "../../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type OrganizationAvatarProps = {
    className?: string;
    organization: Organization;
};

const OrganizationAvatar = ({
    className,
    organization,
}: OrganizationAvatarProps) => (
    <Avatar className={cn(className)}>
        <AvatarImage src={organization.logo!} />
        <AvatarFallback>{organization.name?.charAt(0)}</AvatarFallback>
    </Avatar>
);
export default OrganizationAvatar;
