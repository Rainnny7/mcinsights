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
        <AvatarImage
            src={organization.logo!}
            alt={`${organization.name} Organization Avatar`}
        />
        <AvatarFallback className="text-sm font-normal">
            {organization.name?.charAt(0).toUpperCase()}
        </AvatarFallback>
    </Avatar>
);
export default OrganizationAvatar;
