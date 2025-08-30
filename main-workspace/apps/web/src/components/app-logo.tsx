import { cn } from "@/lib/utils";
import Image from "next/image";

type AppLogoProps = {
    size?: number;
    className?: string;
};

const AppLogo = ({ size = 128, className }: AppLogoProps) => (
    <Image
        className={cn(className)}
        src="/media/logo/app.png"
        alt="Minecraft Metrics"
        width={size}
        height={size}
        unoptimized
        priority
        draggable={false}
    />
);
export default AppLogo;
