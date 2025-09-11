import type { ReactElement } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

const NoServerDataAlert = (): ReactElement => (
    <Alert className="p-4" variant="destructive">
        <AlertTitle className="flex items-center gap-2 text-lg">
            <InfoIcon className="p-1 size-7 bg-muted-foreground/10 text-destructive/70 border border-muted-foreground/10 rounded-lg" />
            <span>Server Data Error</span>
        </AlertTitle>
        <AlertDescription>
            <p>Some of your servers aren't reporting data.</p>
            <ul className="list-inside list-disc text-sm">
                <li>Troubleshooting step 1</li>
                <li>Troubleshooting step 2</li>
                <li>Troubleshooting step 3</li>
            </ul>
        </AlertDescription>
    </Alert>
);
export default NoServerDataAlert;
