import type { ReactElement } from "react";
import { PickaxeIcon } from "../../animate-ui/icons/pickaxe";
import { UsersIcon } from "../../animate-ui/icons/users";
import FadeInAnimation from "../../animation/fade-in-animation";
import StatCard from "../metric/stat-card";

const StatCards = (): ReactElement => (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 w-full">
        <StatCard
            title="Online Players"
            description="The number of players that are currently online"
            icon={<PickaxeIcon />}
            value={0}
        />
        {Array.from({ length: 5 }).map((_, index) => (
            <FadeInAnimation key={index} delay={index * 0.2}>
                <StatCard
                    title="Unique Players"
                    description="The number of unique players that have played on your server"
                    icon={<UsersIcon />}
                    value={0}
                />
            </FadeInAnimation>
        ))}
    </div>
);
export default StatCards;
