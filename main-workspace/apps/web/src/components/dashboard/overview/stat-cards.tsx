"use client";

import { CircleQuestionMarkIcon, DollarSignIcon } from "lucide-react";
import type { ReactElement } from "react";
import CountUp from "react-countup";
import { PickaxeIcon } from "../../animate-ui/icons/pickaxe";
import { UsersIcon } from "../../animate-ui/icons/users";
import ScaleInAnimation from "../../animation/scale-in-animation";
import StatCard from "../metric/stat-card";

const StatCards = (): ReactElement => (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 w-full">
        {/* Online Players */}
        <StatCard
            title="Online Players"
            description="The number of players that are currently online"
            icon={<PickaxeIcon />}
            metric="players_online"
        />

        {/* Unique Players */}
        <StatCard
            title="Unique Players"
            description="The number of unique players that have played on the server"
            icon={<UsersIcon />}
            metric="unique_players"
        />

        {/* Today's Income */}
        <StatCard
            title="Today's Income"
            description="The amount of money that has been earned today"
            icon={<DollarSignIcon />}
            metric="income_today"
            valueFormatter={(value) => (
                <span>
                    <span>$</span>
                    <CountUp end={value} />
                </span>
            )}
        />

        {/* Fillers */}
        {Array.from({ length: 3 }).map((_, index) => (
            <ScaleInAnimation key={index} delay={index * 0.2}>
                <StatCard
                    title="???"
                    description="???"
                    icon={<CircleQuestionMarkIcon />}
                    metric="???"
                />
            </ScaleInAnimation>
        ))}
    </div>
);
export default StatCards;
