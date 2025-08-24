import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Plus, User, Users } from "lucide-react";
import type { ReactElement } from "react";

const OrganizationSwitcher = (): ReactElement => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="w-fit px-1.5">
                    <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-5 items-center justify-center rounded-md">
                        <User className="size-3" />
                    </div>
                    <span className="truncate font-medium">Trigger</span>
                    <ChevronDown className="opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-64 rounded-lg"
                align="start"
                side="bottom"
                sideOffset={4}
            >
                <DropdownMenuLabel className="text-muted-foreground text-xs">
                    Teams
                </DropdownMenuLabel>

                <DropdownMenuItem className="gap-2 p-2">
                    <div className="flex size-6 items-center justify-center rounded-xs border">
                        <Users className="size-4 shrink-0" />
                    </div>
                    Dropdown Team
                    <DropdownMenuShortcut>⌘0</DropdownMenuShortcut>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 p-2">
                    <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                        <Plus className="size-4" />
                    </div>
                    <div className="text-muted-foreground font-medium">
                        Add team
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
export default OrganizationSwitcher;
