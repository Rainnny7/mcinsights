"use client";

import FadeUpAnimation from "@/components/animation/fade-up-animation";
import AppLogo from "@/components/app-logo";
import SimpleTooltip from "@/components/simple-tooltip";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { env } from "@/lib/env";
import { UserIcon } from "lucide-react";
import Image from "next/image";
import { useState, type ReactElement } from "react";

const LoginCard = (): ReactElement => (
    <FadeUpAnimation>
        <Card className="min-w-64">
            {/* Header */}
            <CardHeader className="justify-center">
                <AppLogo className="mx-auto" />
                <CardTitle className="justify-center">
                    <UserIcon className="size-5.5" />
                    <span>Login</span>
                </CardTitle>
                <CardDescription>Please login to continue.</CardDescription>
            </CardHeader>

            {/* Content */}
            <CardContent>
                <DiscordOAuthButton />
            </CardContent>
        </Card>
    </FadeUpAnimation>
);

const DiscordOAuthButton = () => {
    const [loggingIn, setLoggingIn] = useState<boolean>(false);

    const handleLogin = async () => {
        setLoggingIn(true);
        await authClient.signIn.social({
            provider: "discord",
            callbackURL: `${env.NEXT_PUBLIC_BASE_URL}/dashboard`,
        });
        setTimeout(() => {
            setLoggingIn(false);
        }, 2000);
    };

    return (
        <SimpleTooltip content="Login with Discord" side="bottom">
            <Button
                className="w-full flex items-center !bg-[#5865F2] font-medium hover:opacity-75 transition-opacity duration-300 transform-gpu"
                onClick={handleLogin}
            >
                <div className="size-4 flex justify-center items-center">
                    {loggingIn ? (
                        <Spinner />
                    ) : (
                        <Image
                            src="/media/logo/discord.png"
                            alt="Discord"
                            width={28}
                            height={28}
                            draggable={false}
                        />
                    )}
                </div>
                <span>
                    {loggingIn ? "Logging in..." : "Login with Discord"}
                </span>
            </Button>
        </SimpleTooltip>
    );
};

export default LoginCard;
