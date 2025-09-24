"use client";

import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import type { ChangeEvent, ReactNode } from "react";
import { cn } from "../../lib/utils";
import type { User } from "../../types/auth";

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

type OnboardingFieldProps = {
    field: OnboardingField;
    user: User;
    value: string;
    onChange: (value: string) => void;
    validationError?: string;
    asyncValidationError?: string;
    isLoading?: boolean;
};

const OnboardingField = ({
    field,
    user,
    value,
    onChange,
    validationError,
    asyncValidationError,
    isLoading = false,
}: OnboardingFieldProps) => {
    const renderField = () => {
        const commonProps = {
            id: field.name,
            value,
            onChange,
        };

        switch (field.type) {
            // Input types
            case "text":
            case "email":
            case "password":
                return (
                    <Input
                        {...commonProps}
                        type={field.type}
                        placeholderPrefix={field.placeholderPrefix}
                        placeholder={field.placeholder
                            .replace("{user}", user.name)
                            .replace(
                                "{userLowercase}",
                                user.name.toLowerCase()
                            )}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            onChange(event.target.value)
                        }
                        required={field.required}
                    />
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
                                    <div className="flex items-center gap-2 bg-transparent">
                                        {option.icon && (
                                            <Image
                                                src={option.icon}
                                                alt={option.label}
                                                width={20}
                                                height={20}
                                                draggable={false}
                                                unoptimized
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

    const renderValidationMessage = () => {
        const error = validationError || asyncValidationError;
        const hasValue = value.trim();

        let textColor: string | undefined = undefined;
        let text: string | undefined = undefined;

        if (isLoading && field.validationMessages?.loading) {
            textColor = "text-muted-foreground";
            text = field.validationMessages?.loading;
        }
        if (error) {
            textColor = "text-destructive";
            text = error || field.validationMessages?.error;
        }
        if (
            !error &&
            !isLoading &&
            hasValue &&
            field.validationMessages?.success
        ) {
            textColor = "text-green-600";
            text = field.validationMessages?.success;
        }

        if (text) {
            return (
                <motion.p
                    className={cn("text-sm", textColor)}
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
    };

    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={field.name} className="text-sm font-medium">
                <span>{field.label}</span>
                {field.required && (
                    <span className="ml-1 text-destructive">*</span>
                )}
            </label>
            {renderField()}

            {/* Validation Messages */}
            <AnimatePresence>{renderValidationMessage()}</AnimatePresence>
        </div>
    );
};

export default OnboardingField;
export type {
    BaseField,
    CustomField,
    DropdownField,
    OnboardingField,
    TextField,
};
