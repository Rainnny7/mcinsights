"use client";

import { Checkbox } from "@/components/animate-ui/components/radix/checkbox";
import { ArrowRightIcon } from "@/components/animate-ui/icons/arrow-right";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { LockKeyholeIcon } from "@/components/animate-ui/icons/lock-keyhole";
import UserAvatar from "@/components/dashboard/user-avatar";
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
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { env } from "@/lib/env";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent } from "react";
import { useForm, type Control } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
    email: z.email(),
    password: z.string(),
    passwordConfirmation: z.string(),
    rememberMe: z.boolean().optional(),
});
// .refine((data) => data.password === data.passwordConfirmation, {
//     message: "Passwords don't match",
//     path: ["passwordConfirmation"],
// });
type FormSchema = z.infer<typeof formSchema>;

type OAuthProviderInfo = {
    name: string;
    icon: string;
    color: string;
};

const oAuthProviders: Record<string, OAuthProviderInfo> = {
    discord: {
        name: "Discord",
        icon: "/media/logo/discord.png",
        color: "#5865F2",
    },
    github: {
        name: "GitHub",
        icon: "/media/logo/discord.png",
        color: "#232925",
    },
};

const LoginForm = () => {
    const router: AppRouterInstance = useRouter();
    const [step, setStep] = useState<"email" | "register" | "login">("email");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [foundUserAvatar, setFoundUserAvatar] = useState<string | undefined>(
        undefined
    );

    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema as any),
        defaultValues: {
            email: "",
            password: "",
            passwordConfirmation: "",
            rememberMe: false,
        },
    });

    const userExistsQuery = trpc.user.userExists.useQuery(
        { email: form.watch("email") },
        {
            enabled: false, // Only run when manually triggered
            retry: false,
        }
    );

    const handleSubmit = form.handleSubmit(async (data: FormSchema) => {
        if (!form.formState.isValid || isLoading) {
            return;
        }
        // On the email step, check if the user exists and
        // redirect to the appropriate step based on the result
        if (step === "email") {
            setIsLoading(true);
            try {
                const result = await userExistsQuery.refetch();
                setStep(result.data?.exists ? "login" : "register");
                if (result.data?.exists) {
                    setFoundUserAvatar(result.data.user?.avatar!);
                }
            } catch (error) {
                setStep("email");
                console.error("Error checking user existence:", error);
            } finally {
                setIsLoading(false);
            }
        } else {
            // On the login or register step, submit the form
            if (step === "register") {
                await handleRegister(data.email, data.password);
            } else {
                await handleLogin(data.email, data.password, data.rememberMe!);
            }
        }
    });

    const handleRegister = async (email: string, password: string) => {
        try {
            setIsLoading(true);
            const { data } = await authClient.signUp.email({
                name: email.split("@")[0],
                email,
                password,
            });
            if (data) {
                router.push(`/onboarding`);
            }
        } catch (error) {
            console.error("Error registering user:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async (
        email: string,
        password: string,
        rememberMe: boolean
    ) => {
        try {
            setIsLoading(true);
            await authClient.signIn.email({
                email,
                password,
                rememberMe,
                callbackURL: `${env.NEXT_PUBLIC_BASE_URL}/dashboard`,
            });
        } catch (error) {
            console.error("Error logging in user:", error);
        } finally {
            setTimeout(() => setIsLoading(false), 2000);
        }
    };

    return (
        <Form {...form}>
            <form
                className="w-full flex flex-col gap-4.5"
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
                                    icon={
                                        foundUserAvatar ? (
                                            <UserAvatar
                                                avatar={foundUserAvatar}
                                            />
                                        ) : (
                                            <MailIcon />
                                        )
                                    }
                                    value={field.value}
                                    disabled={step !== "email"}
                                    onChange={(
                                        event: ChangeEvent<HTMLInputElement>
                                    ) => field.onChange(event.target.value)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Password and Password Confirmation */}
                <AnimatePresence>
                    {step !== "email" && (
                        <PasswordField key="password" control={form.control} />
                    )}
                    {step === "register" && (
                        <PasswordField
                            key="confirmation"
                            control={form.control}
                            confirmation
                        />
                    )}
                </AnimatePresence>

                {/* Bottom */}
                <div className="flex flex-col xs:flex-row gap-4.5 xs:gap-1.5 xs:items-center">
                    {/* Remember Me */}
                    {step === "login" && (
                        <FormField
                            control={form.control}
                            name="rememberMe"
                            render={({ field }) => (
                                <FormItem className="w-full flex-row items-center">
                                    <FormControl>
                                        <Checkbox
                                            size="sm"
                                            variant="accent"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel className="text-muted-foreground font-light">
                                        Remember Me
                                    </FormLabel>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    {/* Submit */}
                    <AnimateIcon animateOnHover>
                        <Button
                            className={cn(
                                "-mt-1 transition-all duration-300 ease-in-out transform-gpu",
                                step !== "login" && "w-full"
                            )}
                            size="sm"
                            type="submit"
                            disabled={!form.formState.isValid || isLoading}
                        >
                            <span>
                                {step === "email"
                                    ? "Continue"
                                    : step === "register"
                                    ? "Register"
                                    : "Login"}
                            </span>
                            {isLoading ? (
                                <Spinner className="size-4" />
                            ) : (
                                <ArrowRightIcon className="size-4" />
                            )}
                        </Button>
                    </AnimateIcon>
                </div>

                {/* OAuth Buttons */}
                {step === "email" && (
                    <div className="flex flex-col gap-4">
                        {/* Or */}
                        <div className="flex justify-center items-center">
                            <Separator className="!w-24" />
                            <span className="px-4 text-sm text-muted-foreground/70">
                                Or
                            </span>
                            <Separator className="!w-24" />
                        </div>

                        {/* Providers */}
                        <div className="grid grid-cols-2 gap-2.5">
                            {Object.entries(oAuthProviders).map(
                                ([id, provider]) => (
                                    <OAuthButton
                                        key={id}
                                        id={id}
                                        provider={provider}
                                    />
                                )
                            )}
                        </div>
                    </div>
                )}
            </form>
        </Form>
    );
};

const PasswordField = ({
    control,
    confirmation,
}: {
    control: Control<FormSchema>;
    confirmation?: boolean;
}) => (
    <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
    >
        <FormField
            control={control}
            name={confirmation ? "passwordConfirmation" : "password"}
            render={({ field }) => (
                <FormItem className="w-full">
                    <FormLabel>
                        {confirmation ? "Confirm Password" : "Password"}{" "}
                        <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                        <Password
                            placeholder={
                                confirmation ? "Confirm Password" : "Password"
                            }
                            icon={<LockKeyholeIcon />}
                            required
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    </motion.div>
);

const OAuthButton = ({
    id,
    provider,
}: {
    id: string;
    provider: OAuthProviderInfo;
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleLogin = async () => {
        setIsLoading(true);
        await authClient.signIn.social({
            provider: id,
            newUserCallbackURL: `${env.NEXT_PUBLIC_BASE_URL}/onboarding`,
            callbackURL: `${env.NEXT_PUBLIC_BASE_URL}/dashboard`,
        });
        setTimeout(() => setIsLoading(false), 2000);
    };

    return (
        <SimpleTooltip content={`Continue with ${provider.name}`} side="bottom">
            <Button
                className="flex items-center hover:opacity-75 transition-opacity duration-300 transform-gpu"
                variant="secondary"
                type="button"
                style={{ backgroundColor: provider.color }}
                disabled={isLoading}
                onClick={handleLogin}
            >
                <div className="size-4 flex justify-center items-center">
                    {isLoading ? (
                        <Spinner />
                    ) : (
                        <Image
                            src={provider.icon}
                            alt={provider.name}
                            width={44}
                            height={44}
                            draggable={false}
                        />
                    )}
                </div>
                <span>{provider.name}</span>
            </Button>
        </SimpleTooltip>
    );
};

export default LoginForm;
