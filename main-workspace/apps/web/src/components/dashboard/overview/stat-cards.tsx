import type { ReactElement } from "react";
import { PickaxeIcon } from "../../animate-ui/icons/pickaxe";
import { UsersIcon } from "../../animate-ui/icons/users";
import FadeInAnimation from "../../animation/fade-in-animation";
import StatCard from "../metric/stat-card";

const StatCards = (): ReactElement => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full">
        <StatCard
            title="Online Players"
            description="The number of players that are currently online"
            icon={<PickaxeIcon />}
            value={7}
        />
        {Array.from({ length: 4 }).map((_, index) => (
            <FadeInAnimation key={index} delay={index * 0.3}>
                <StatCard
                    title="Unique Players"
                    description="The number of unique players that have played on your server"
                    icon={<UsersIcon />}
                    value={Math.floor(Math.random() * 1000)}
                />
            </FadeInAnimation>
        ))}
    </div>
);
export default StatCards;
