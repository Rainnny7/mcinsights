import { cn } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";
import type { ReactElement } from "react";

type SpinnerProps = {
    className?: string;
};

const Spinner = ({ className }: SpinnerProps): ReactElement => (
    <Loader2Icon className={cn("size-4 animate-spin", className)} />
);
export default Spinner;
