import type { ReactElement } from "react";
import { PickaxeIcon } from "../../animate-ui/icons/pickaxe";
import ScaleInAnimation from "../../animation/scale-in-animation";
import StatCard from "../metric/stat-card";

const StatCards = (): ReactElement => (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 w-full">
        <StatCard
            title="Online Players"
            description="The number of players that are currently online"
            icon={<PickaxeIcon />}
            metric="players_online"
        />
        {Array.from({ length: 5 }).map((_, index) => (
            <ScaleInAnimation key={index} delay={index * 0.2}>
                <StatCard
                    title="Online Players"
                    description="The number of players that are currently online"
                    icon={<PickaxeIcon />}
                    metric="players_online"
                />
            </ScaleInAnimation>
        ))}
    </div>
);
export default StatCards;
