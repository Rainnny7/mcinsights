import FadeInAnimation from "@/components/animation/fade-in-animation";
import { SettingsIcon } from "lucide-react";
import type { Metadata } from "next";
import type { ReactElement } from "react";
import DashboardPageHeader from "../../../../../components/dashboard/page-header";
import SettingOption from "../../../../../components/setting/setting-option";
import SettingsGroup from "../../../../../components/setting/settings-group";

export const metadata: Metadata = {
    title: "Settings",
    description: "Manage settings for your organization.",
};

const SettingsPage = (): ReactElement => (
    <DashboardPageHeader
        icon={<SettingsIcon />}
        title="Settings"
        description="Manage settings for your organization."
        withIconClasses={false}
    >
        <GeneralSettings />
        <FadeInAnimation delay={0.6}>
            <MembersSettings />
        </FadeInAnimation>
        <FadeInAnimation delay={0.8}>
            {" "}
            <DangerZone />
        </FadeInAnimation>
    </DashboardPageHeader>
);

const GeneralSettings = (): ReactElement => (
    <SettingsGroup title="General Settings">
        <SettingOption
            title="Organization"
            description="Manage your organization's details."
        />
        <span>This will be for the pfp, name, and slug</span>
    </SettingsGroup>
);

const MembersSettings = (): ReactElement => (
    <SettingsGroup title="Members">
        <SettingOption
            title="Members"
            description="Manage your organization's members."
        />
    </SettingsGroup>
);

const DangerZone = (): ReactElement => (
    <SettingsGroup title="Danger Zone" variant="destructive">
        <SettingOption
            title="Delete Organization"
            description="Delete your organization."
        />
    </SettingsGroup>
);

export default SettingsPage;
