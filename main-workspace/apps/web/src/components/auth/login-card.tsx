"use client";

import { ArrowRightIcon } from "@/components/animate-ui/icons/arrow-right";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { Password } from "@/components/password";
import SimpleTooltip from "@/components/simple-tooltip";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { env } from "@/lib/env";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
    email: z.email().optional(),
    password: z.string(),
});
type FormSchema = z.infer<typeof formSchema>;

const LoginForm = () => {
    const [step, setStep] = useState<"email" | "password">("email");

    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema as any),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const handleSubmit = form.handleSubmit(async (data: FormSchema) => {
        if (step === "email") {
            setStep("password");
        } else {
            console.log(data);
        }
    });

    return (
        <Form {...form}>
            <form
                className="w-full flex flex-col gap-2.5"
                onSubmit={handleSubmit}
            >
                {/* Email */}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>
                                Email Address{" "}
                                <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={field.value}
                                    onChange={(
                                        event: ChangeEvent<HTMLInputElement>
                                    ) => field.onChange(event.target.value)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Password */}
                <AnimatePresence>
                    {step === "password" && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            Password{" "}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </FormLabel>
                                        <FormControl>
                                            <Password
                                                placeholder="Password"
                                                required
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                <DiscordOAuthButton />

                {/* Submit */}
                <AnimateIcon animateOnHover>
                    <Button
                        className="mt-2"
                        size="sm"
                        type="submit"
                        disabled={!form.formState.isValid}
                    >
                        <span>{step === "email" ? "Continue" : "Login"}</span>
                        <ArrowRightIcon className="size-4" />
                    </Button>
                </AnimateIcon>
            </form>
        </Form>
    );
};

const DiscordOAuthButton = () => {
    const [loggingIn, setLoggingIn] = useState<boolean>(false);

    const handleLogin = async () => {
        setLoggingIn(true);
        await authClient.signIn.social({
            provider: "discord",
            newUserCallbackURL: `${env.NEXT_PUBLIC_BASE_URL}/onboarding`,
            callbackURL: `${env.NEXT_PUBLIC_BASE_URL}/dashboard`,
        });
        setTimeout(() => {
            setLoggingIn(false);
        }, 2000);
    };

    return (
        <SimpleTooltip content="Continue with Discord" side="bottom">
            <Button
                className="w-full flex items-center !bg-[#5865F2] text-white font-medium hover:opacity-75 transition-opacity duration-300 transform-gpu"
                onClick={handleLogin}
            >
                <div className="size-4 flex justify-center items-center">
                    {loggingIn ? (
                        <Spinner />
                    ) : (
                        <Image
                            src="/media/logo/discord.png"
                            alt="Discord"
                            width={36}
                            height={36}
                            draggable={false}
                        />
                    )}
                </div>
                <span>
                    {loggingIn ? "Logging in..." : "Continue with Discord"}
                </span>
            </Button>
        </SimpleTooltip>
    );
};

export default LoginForm;
