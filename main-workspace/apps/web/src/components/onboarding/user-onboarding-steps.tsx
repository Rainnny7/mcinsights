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
import { ServerIcon, type LucideIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { ReactElement } from "react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import { authClient } from "../../lib/auth-client";
import { env } from "../../lib/env";
import { trpc } from "../../lib/trpc";
import type { User } from "../../types/auth";
import { ArrowLeftIcon } from "../animate-ui/icons/arrow-left";
import { ArrowRightIcon } from "../animate-ui/icons/arrow-right";
import { AnimateIcon } from "../animate-ui/icons/icon";
import FadeInAnimation from "../animation/fade-in-animation";
import AvatarUploader from "../avatar-uploader";
import SimpleTooltip from "../simple-tooltip";
import {
    Stepper,
    StepperIndicator,
    StepperItem,
    StepperSeparator,
    StepperTitle,
    StepperTrigger,
} from "../ui/stepper";
import DownloadPluginButton from "./download-plugin-button";
import OnboardingFieldComponent, {
    type OnboardingField,
} from "./onboarding-field";

type OnboardingStep = {
    id: number;
    icon: LucideIcon | string;
    title: string;
    stepperTitle: string;
    description: string;
    skippable?: boolean;
    skipCompletesForm?: boolean;
    fields: OnboardingField[];
};

const steps: OnboardingStep[] = [
    {
        id: 1,
        icon: "{avatar}",
        title: "Welcome {user} to MCInsights!",
        stepperTitle: "Organization",
        description: "Let's first get started by creating your organization.",
        fields: [
            {
                name: "orgAvatar",
                label: "Organization Avatar",
                type: "custom",
                component: <AvatarUploader />,
            },
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
                placeholder: "{userLowercase}s-org",
                defaultValue: "{userLowercase}s-org",
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
        stepperTitle: "Server",
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
    const [hasMounted, setHasMounted] = useState<boolean>(false);
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

    useEffect(() => setHasMounted(true), []);

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
                toast.success(
                    <span className="flex gap-1 items-center">
                        Welcome to MCInsights, {user.name}!{" "}
                        <Image
                            src="/media/waving-hand.gif"
                            alt="Waving Hand"
                            width={24}
                            height={24}
                            draggable={false}
                        />
                    </span>
                );
                router.push(`/dashboard/${formData.orgSlug}`);
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

    return (
        <Card className="p-0 flex-row gap-4 shadow-lg divide-x divide-border overflow-hidden">
            {/* Form */}
            <form
                className="w-screen p-6 max-w-[32rem] flex flex-col"
                onSubmit={handleSubmit}
            >
                {/* Header */}
                <OnboardingHeader
                    currentStep={currentStep}
                    currentStepData={currentStepData}
                    user={user}
                />

                {/* Content */}
                <CardContent className="p-0 my-5 space-y-4">
                    {currentStepData.fields.map(
                        (field: OnboardingField, index: number) => (
                            <FadeInAnimation
                                key={field.name}
                                delay={(hasMounted ? 0.2 : 1.5) + index * 0.1}
                            >
                                <OnboardingFieldComponent
                                    field={field}
                                    user={user}
                                    value={formData[field.name] || ""}
                                    onChange={(value: string) =>
                                        handleInputChange(field.name, value)
                                    }
                                    validationError={getFieldValidationError(
                                        field
                                    )}
                                    asyncValidationError={
                                        asyncValidationErrors[field.name]
                                    }
                                    isLoading={
                                        asyncValidationLoading[field.name]
                                    }
                                />
                            </FadeInAnimation>
                        )
                    )}
                </CardContent>

                {/* Footer */}
                <FadeInAnimation
                    className="mt-auto"
                    delay={1.9}
                    direction="bottom"
                >
                    <OnboardingControls
                        currentStepData={currentStepData}
                        isFirstStep={isFirstStep}
                        isLastStep={isLastStep}
                        isOnboarding={isOnboarding}
                        isCurrentStepValid={isCurrentStepValid}
                        handlePrevious={handlePrevious}
                        handleSkip={handleSkip}
                    />
                </FadeInAnimation>
            </form>

            {/* Dashboard Preview */}
            <FadeInAnimation
                className="hidden lg:block"
                delay={1.5}
                direction="right"
            >
                <Image
                    className="w-[29rem] mt-3.5 object-left object-cover rounded-tl-xl rounded-br-xl"
                    src="/media/dashboard-preview.png"
                    alt="Dashboard Preview"
                    width={496}
                    height={496}
                    draggable={false}
                    unoptimized
                />
            </FadeInAnimation>
        </Card>
    );
};

const OnboardingHeader = ({
    currentStep,
    currentStepData,
    user,
}: {
    currentStep: number;
    currentStepData: OnboardingStep;
    user: User;
}): ReactElement => (
    <>
        {/* Header */}
        <CardHeader className="p-0 gap-3">
            {/* Current Step */}
            <FadeInAnimation className="mb-3.5" delay={1.1}>
                <OnboardingStepper currentStep={currentStep} />
            </FadeInAnimation>

            <FadeInAnimation delay={1.3}>
                <div className="flex flex-col gap-1">
                    {/* Title */}
                    <CardTitle>
                        {/* Title */}
                        {typeof currentStepData.icon === "string" ? (
                            <Image
                                className="rounded-full"
                                src={currentStepData.icon.replace(
                                    "{avatar}",
                                    user.image!
                                )}
                                alt={currentStepData.title}
                                width={24}
                                height={24}
                                unoptimized
                                draggable={false}
                            />
                        ) : (
                            <currentStepData.icon className="size-5" />
                        )}
                        <span>
                            {currentStepData.title.replace("{user}", user.name)}
                        </span>
                    </CardTitle>

                    {/* Description */}
                    <CardDescription>
                        {currentStepData.description}
                    </CardDescription>
                </div>
            </FadeInAnimation>
        </CardHeader>
    </>
);

const OnboardingStepper = ({
    currentStep,
}: {
    currentStep: number;
}): ReactElement => (
    <Stepper value={currentStep}>
        {steps.map((step: OnboardingStep, index: number) => (
            <StepperItem
                key={step.id}
                step={index + 1}
                className="not-last:flex-1 max-md:items-start"
            >
                <StepperTrigger className="rounded max-md:flex-col">
                    <StepperIndicator />
                    <div className="text-center md:text-left">
                        <StepperTitle>{step.stepperTitle}</StepperTitle>
                    </div>
                </StepperTrigger>
                {index < steps.length - 1 && (
                    <StepperSeparator className="max-md:mt-3.5 md:mx-4" />
                )}
            </StepperItem>
        ))}
    </Stepper>
);

const OnboardingControls = ({
    currentStepData,
    isFirstStep,
    isLastStep,
    isOnboarding,
    isCurrentStepValid,
    handlePrevious,
    handleSkip,
}: {
    currentStepData: OnboardingStep;
    isFirstStep: boolean;
    isLastStep: boolean;
    isOnboarding: boolean;
    isCurrentStepValid: () => boolean;
    handlePrevious: () => void;
    handleSkip: () => void;
}): ReactElement => (
    <CardFooter className="p-0 flex justify-between">
        {/* Previous */}
        <SimpleTooltip content="Go back" side="bottom">
            <div>
                <AnimateIcon animateOnHover>
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isFirstStep}
                        onClick={handlePrevious}
                    >
                        <ArrowLeftIcon className="size-4" />
                        Back
                    </Button>
                </AnimateIcon>
            </div>
        </SimpleTooltip>

        {/* Right */}
        <div className="flex items-center gap-2">
            {/* Skip */}
            {currentStepData.skippable && (
                <SimpleTooltip content="Skip this step" side="bottom">
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
                content={isLastStep ? "Let's go!" : "Continue to the next step"}
                side="bottom"
            >
                <div>
                    <AnimateIcon animateOnHover>
                        <Button
                            type="submit"
                            disabled={!isCurrentStepValid() || isOnboarding}
                        >
                            {isLastStep ? "Complete" : "Next"}
                            <ArrowRightIcon className="size-4" />
                        </Button>
                    </AnimateIcon>
                </div>
            </SimpleTooltip>
        </div>
    </CardFooter>
);

// Initialize form data with default values
const initializeFormData = (user: User): Record<string, string> => {
    const initialData: Record<string, string> = {};
    steps.forEach((step) => {
        step.fields.forEach((field) => {
            if (field.defaultValue) {
                initialData[field.name] = field.defaultValue
                    .replace("{user}", user.name)
                    .replace("{userLowercase}", user.name.toLowerCase());
            }
        });
    });
    return initialData;
};

export default UserOnboardingSteps;
