"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ServerIcon, type LucideIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { ChangeEvent, ReactElement, ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import { authClient } from "../../lib/auth-client";
import { env } from "../../lib/env";
import { trpc } from "../../lib/trpc";
import { cn } from "../../lib/utils";
import type { User } from "../../types/auth";
import SimpleTooltip from "../simple-tooltip";
import DownloadPluginButton from "./download-plugin-button";

type BaseField = {
    name: string;
    label: string;
    defaultValue?: string;
    required?: boolean;
    regex?: RegExp;
    regexErrorMessage?: string;
    customValidation?: (
        value: string
    ) => Promise<string | undefined> | string | undefined;
    validationMessages?: {
        loading?: string;
        error?: string;
        success?: string;
    };
};

type TextField = BaseField & {
    type: "text" | "email" | "password";
    placeholderPrefix?: string;
    placeholder: string;
};

type DropdownField = BaseField & {
    type: "dropdown";
    options: { value: string; icon?: string; label: string }[];
    placeholder?: string;
};

type CustomField = BaseField & {
    type: "custom";
    component: ReactNode;
};

type OnboardingField = TextField | DropdownField | CustomField;

type OnboardingStep = {
    id: number;
    icon: LucideIcon | string;
    title: string;
    description: string;
    skippable?: boolean;
    skipCompletesForm?: boolean;
    fields: OnboardingField[];
};

const steps: OnboardingStep[] = [
    {
        id: 1,
        icon: "/media/waving-hand.gif",
        title: "Welcome {user}, let's get you started!",
        description: "Let's start by setting up your organization.",
        fields: [
            {
                name: "orgName",
                label: "Organization Name",
                placeholder: "{user}'s Organization",
                defaultValue: "{user}'s Organization",
                type: "text",
                required: true,
                regex: new RegExp("^[A-Za-z0-9\\s']+$"),
                regexErrorMessage:
                    "The organization name must contain only letters, numbers, apostrophes, and spaces.",
            },
            {
                name: "orgSlug",
                label: "Organization Slug",
                placeholderPrefix: `${
                    new URL(env.NEXT_PUBLIC_BASE_URL).hostname
                }/dashboard/`,
                placeholder: "my-cool-org",
                type: "text",
                required: true,
                regex: new RegExp("^[a-z0-9-]+$"),
                regexErrorMessage:
                    "Slug must contain only lowercase letters, numbers, and hyphens",
                customValidation: async (value: string) => {
                    const { error } = await authClient.organization.checkSlug({
                        slug: value,
                    });
                    return error
                        ? "This org slug is already taken, try another one."
                        : undefined;
                },
                validationMessages: {
                    loading: "Checking if org is available...",
                    success: "Great! This org slug is available.",
                },
            },
        ],
    },
    {
        id: 2,
        icon: ServerIcon,
        title: "Creating your first server",
        description: "Create your first server to get started monitoring!",
        skippable: true,
        skipCompletesForm: true,
        fields: [
            {
                name: "serverName",
                label: "Server Name",
                placeholder: "My Proxy Server",
                type: "text",
                required: true,
                regex: new RegExp("^[A-Za-z0-9\\s']+$"),
                regexErrorMessage:
                    "The organization name must contain only letters, numbers, apostrophes, and spaces.",
            },
            {
                name: "serverPlatform",
                label: "Server Platform",
                type: "dropdown",
                required: true,
                options: [
                    {
                        value: "proxy",
                        icon: "/media/logo/velocity.png",
                        label: "Proxy (Velocity, BungeeCord, etc.)",
                    },
                    {
                        value: "standalone",
                        icon: "/media/logo/papermc.png",
                        label: "Standalone (Paper, Spigot, etc.)",
                    },
                ],
                placeholder: "Select platform",
            },
            {
                name: "pluginDownload",
                label: "Plugin Download",
                type: "custom",
                component: <DownloadPluginButton />,
            },
        ],
    },
];

const UserOnboardingSteps = ({ user }: { user: User }): ReactElement => {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState<number>(1);

    const [formData, setFormData] = useState<Record<string, string>>(
        initializeFormData(user)
    );
    const [debouncedFormData] = useDebounce(formData, 300);

    const currentStepData: OnboardingStep =
        steps.find((step: OnboardingStep) => step.id === currentStep) ??
        steps[0];
    const isFirstStep: boolean = currentStep === 1;
    const isLastStep: boolean = currentStep === steps.length;

    const [asyncValidationErrors, setAsyncValidationErrors] = useState<
        Record<string, string | undefined>
    >({});
    const [asyncValidationLoading, setAsyncValidationLoading] = useState<
        Record<string, boolean>
    >({});

    const completeOnboardingMutation =
        trpc.user.completeOnboarding.useMutation();
    const [isOnboarding, setIsOnboarding] = useState<boolean>(false);

    // Run async validation when debounced form data changes
    useEffect(() => {
        const runAsyncValidation = async () => {
            const newErrors: Record<string, string | undefined> = {};
            const newLoading: Record<string, boolean> = {};

            for (const field of currentStepData.fields) {
                if (field.customValidation) {
                    const value = debouncedFormData[field.name] || "";
                    const syncError = getFieldValidationError(field);

                    // Only run async validation if there's no sync error and there's a value
                    if (syncError === undefined && value.trim()) {
                        newLoading[field.name] = true;
                        try {
                            const result = await field.customValidation(value);
                            newErrors[field.name] =
                                typeof result === "string" ? result : undefined;
                        } catch (error) {
                            newErrors[field.name] =
                                "Validation failed. Please try again.";
                        } finally {
                            newLoading[field.name] = false;
                        }
                    } else {
                        // If there's a sync error, don't run async validation and clear any existing async errors
                        newLoading[field.name] = false;
                        newErrors[field.name] = undefined;
                    }
                }
            }

            setAsyncValidationErrors(newErrors);
            setAsyncValidationLoading(newLoading);
        };
        runAsyncValidation();
    }, [debouncedFormData, currentStepData.fields]);

    const handleInputChange = (fieldName: string, value: string) => {
        setFormData((prev: Record<string, string>) => ({
            ...prev,
            [fieldName]: value,
        }));

        // Clear async validation error and set loading when user starts typing
        setAsyncValidationErrors((prev) => ({
            ...prev,
            [fieldName]: undefined,
        }));

        // Set loading state for fields with custom validation
        const field = currentStepData.fields.find((f) => f.name === fieldName);
        if (field?.customValidation) {
            setAsyncValidationLoading((prev) => ({
                ...prev,
                [fieldName]: true,
            }));
        }
    };

    const handlePrevious = () => {
        if (!isFirstStep) {
            setCurrentStep((prev: number) => prev - 1);
        }
    };

    const handleNext = () => {
        if (!isLastStep) {
            setCurrentStep((prev: number) => prev + 1);
        } else {
            handleOnboardingComplete();
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (isCurrentStepValid()) {
            handleNext();
        }
    };

    const handleSkip = () => {
        if (currentStepData.skipCompletesForm) {
            handleOnboardingComplete();
        } else {
            handleNext();
        }
    };

    const handleOnboardingComplete = async () => {
        setIsOnboarding(true);

        try {
            // Try and complete onboarding with the form data
            const response = await completeOnboardingMutation.mutateAsync({
                orgName: formData.orgName,
                orgSlug: formData.orgSlug,
                serverName: formData.serverName,
                serverPlatform: formData.serverPlatform,
            });
            if (response.success) {
                toast.success(`Welcome to Minecraft Metrics, ${user.name}!`);
                router.push("/dashboard");
            }
        } catch (error) {
            setIsOnboarding(false);
            console.error("Onboarding failed:", error);
            toast.error("Onboarding", {
                description: "Failed to complete onboarding ):",
            });
        }
    };

    const getFieldValidationError = useCallback(
        (field: OnboardingField): string | undefined => {
            const value = formData[field.name] || "";

            // Required field validation
            if (field.required && !value.trim()) return "";

            // Regex validation
            if (field.regex && value.trim()) {
                try {
                    return field.regex.test(value)
                        ? undefined
                        : field.regexErrorMessage || "Invalid format";
                } catch {
                    console.error(
                        `Invalid regex pattern for field ${field.name}:`,
                        field.regex
                    );
                    return "Invalid validation pattern";
                }
            }

            return undefined;
        },
        [formData]
    );

    const isCurrentStepValid = useCallback((): boolean => {
        if (!currentStepData) return false;

        return currentStepData.fields.every((field: OnboardingField) => {
            const syncError = getFieldValidationError(field);
            const asyncError = asyncValidationErrors[field.name];
            const isLoading = asyncValidationLoading[field.name];

            // Form is invalid if there are sync errors, async errors, or if async validation is still loading
            return (
                syncError === undefined &&
                asyncError === undefined &&
                !isLoading
            );
        });
    }, [
        currentStepData,
        getFieldValidationError,
        asyncValidationErrors,
        asyncValidationLoading,
    ]);

    const renderField = (field: OnboardingField) => {
        const commonProps = {
            id: field.name,
            value: formData[field.name] || "",
            onChange: (value: string) => handleInputChange(field.name, value),
        };

        switch (field.type) {
            // Input types
            case "text":
            case "email":
            case "password":
                return (
                    <div className="relative">
                        {field.placeholderPrefix && (
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground/85">
                                {field.placeholderPrefix}
                            </span>
                        )}

                        <Input
                            {...commonProps}
                            type={field.type}
                            placeholder={field.placeholder.replace(
                                "{user}",
                                user.name
                            )}
                            onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                handleInputChange(
                                    field.name,
                                    event.target.value
                                )
                            }
                            required={field.required}
                            style={{
                                paddingLeft: field.placeholderPrefix
                                    ? `${
                                          field.placeholderPrefix.length * 7.5
                                      }px`
                                    : undefined,
                            }}
                        />
                    </div>
                );

            // Dropdown type
            case "dropdown":
                return (
                    <Select
                        value={commonProps.value}
                        onValueChange={commonProps.onChange}
                    >
                        <SelectTrigger>
                            <SelectValue
                                placeholder={field.placeholder?.replace(
                                    "{user}",
                                    user.name
                                )}
                            />
                        </SelectTrigger>
                        <SelectContent>
                            {field.options.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    className="pl-2.5"
                                    value={option.value}
                                >
                                    <div className="flex items-center gap-2">
                                        {option.icon && (
                                            <Image
                                                src={option.icon}
                                                alt={option.label}
                                                width={20}
                                                height={20}
                                                draggable={false}
                                            />
                                        )}
                                        {option.label}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );

            // Custom type
            case "custom":
                return field.component;
        }
    };

    return (
        <Card className="w-screen min-w-80 max-w-[40rem]">
            <form onSubmit={handleSubmit}>
                {/* Header */}
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                            Step {currentStep} of {steps.length}
                        </span>
                    </CardTitle>
                    <CardTitle>
                        {typeof currentStepData.icon === "string" ? (
                            <Image
                                src={currentStepData.icon}
                                alt={currentStepData.title}
                                width={24}
                                height={24}
                                draggable={false}
                            />
                        ) : (
                            <currentStepData.icon className="size-4" />
                        )}
                        <span>
                            {currentStepData.title.replace("{user}", user.name)}
                        </span>
                    </CardTitle>
                    <CardDescription>
                        {currentStepData.description}
                    </CardDescription>
                </CardHeader>

                {/* Content */}
                <CardContent className="my-5 space-y-4">
                    {currentStepData.fields.map((field: OnboardingField) => (
                        <div key={field.name} className="flex flex-col gap-2">
                            <label
                                htmlFor={field.name}
                                className="text-sm font-medium"
                            >
                                <span>{field.label}</span>
                                {field.required && (
                                    <span className="ml-1 text-destructive">
                                        *
                                    </span>
                                )}
                            </label>
                            {renderField(field)}

                            {/* Validation Messages */}
                            <AnimatePresence>
                                {(() => {
                                    const validationError =
                                        getFieldValidationError(field) ||
                                        asyncValidationErrors[field.name];
                                    const isLoading =
                                        asyncValidationLoading[field.name];
                                    const hasValue = (
                                        formData[field.name] || ""
                                    ).trim();

                                    let textColor: string | undefined =
                                        undefined;
                                    let text: string | undefined = undefined;
                                    if (
                                        isLoading &&
                                        field.validationMessages?.loading
                                    ) {
                                        textColor = "text-muted-foreground";
                                        text =
                                            field.validationMessages?.loading;
                                    }
                                    if (validationError) {
                                        textColor = "text-destructive";
                                        text =
                                            validationError ||
                                            field.validationMessages?.error;
                                    }
                                    if (
                                        !validationError &&
                                        !isLoading &&
                                        hasValue &&
                                        field.validationMessages?.success
                                    ) {
                                        textColor = "text-green-600";
                                        text =
                                            field.validationMessages?.success;
                                    }

                                    if (text) {
                                        return (
                                            <motion.p
                                                className={cn(
                                                    "text-sm",
                                                    textColor
                                                )}
                                                initial={{
                                                    opacity: 0,
                                                    height: 0,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    height: "auto",
                                                }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{
                                                    duration: 0.15,
                                                    ease: "easeInOut" as const,
                                                }}
                                            >
                                                {text}
                                            </motion.p>
                                        );
                                    }
                                })()}
                            </AnimatePresence>
                        </div>
                    ))}
                </CardContent>

                <CardFooter className="flex justify-between">
                    {/* Previous */}
                    <SimpleTooltip content="Go back" side="bottom">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isFirstStep}
                            onClick={handlePrevious}
                        >
                            Back
                        </Button>
                    </SimpleTooltip>

                    {/* Right */}
                    <div className="flex items-center gap-2">
                        {/* Skip */}
                        {currentStepData.skippable && (
                            <SimpleTooltip
                                content="Skip this step"
                                side="bottom"
                            >
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={isLastStep || isOnboarding}
                                    onClick={handleSkip}
                                >
                                    Skip
                                </Button>
                            </SimpleTooltip>
                        )}

                        {/* Next */}
                        <SimpleTooltip
                            content={
                                isLastStep ? "Let's go!" : "Let's continue"
                            }
                            side="bottom"
                        >
                            <Button
                                type="submit"
                                disabled={!isCurrentStepValid() || isOnboarding}
                            >
                                {isLastStep ? "Complete" : "Next"}
                            </Button>
                        </SimpleTooltip>
                    </div>
                </CardFooter>
            </form>
        </Card>
    );
};

// Initialize form data with default values
const initializeFormData = (user: User): Record<string, string> => {
    const initialData: Record<string, string> = {};
    steps.forEach((step) => {
        step.fields.forEach((field) => {
            if (field.defaultValue) {
                initialData[field.name] = field.defaultValue.replace(
                    "{user}",
                    user.name
                );
            }
        });
    });
    return initialData;
};

export default UserOnboardingSteps;
