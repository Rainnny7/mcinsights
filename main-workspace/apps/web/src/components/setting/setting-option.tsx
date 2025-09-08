import type { ReactElement, ReactNode } from "react";

type SettingOptionProps = {
    title: string;
    description: string;
    children?: ReactNode;
};

const SettingOption = ({
    title,
    description,
    children,
}: SettingOptionProps): ReactElement => (
    <div className="flex gap-24 justify-between items-center">
        {/* Name / Description */}
        <div className="flex flex-col">
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        {/* Setting */}
        <div className="flex flex-col gap-2">{children}</div>
    </div>
);
export default SettingOption;
