import type { ReactElement } from "react";
import { PlusIcon } from "../../animate-ui/icons/plus";
import SimpleTooltip from "../../simple-tooltip";
import { Button } from "../../ui/button";

const NewDashboardButton = (): ReactElement => (
    <SimpleTooltip content="Create a new dashboard" side="bottom">
        <Button
            className="!size-7 border border-border"
            variant="ghost"
            size="icon"
        >
            <PlusIcon className="size-4" />
        </Button>
    </SimpleTooltip>
);
export default NewDashboardButton;
