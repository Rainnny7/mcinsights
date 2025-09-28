"use client";

import { useEffect, useState } from "react";

import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { SearchIcon } from "@/components/animate-ui/icons/search";
import SimpleTooltip from "@/components/simple-tooltip";
import { Button } from "@/components/ui/button";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { ScreenSize, useIsScreenSize } from "@/hooks/use-mobile";
import type { ReactElement } from "react";

const SearchInput = (): ReactElement => {
    const isSmallScreen: boolean = useIsScreenSize(ScreenSize.Small);
    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        const down = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key === "k") {
                event.preventDefault();
                setOpen((open: boolean) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    return (
        <>
            {/* Input */}
            <SimpleTooltip content="Click to search" side="bottom">
                {isSmallScreen ? (
                    <AnimateIcon animateOnHover>
                        <Button
                            className="size-8.5 border border-border rounded-full"
                            variant="ghost"
                            size="icon"
                            onClick={() => setOpen(true)}
                        >
                            <SearchIcon className="size-4.5" />
                        </Button>
                    </AnimateIcon>
                ) : (
                    <Input
                        className="min-w-36 h-8 cursor-pointer"
                        placeholder="Search..."
                        icon={<SearchIcon />}
                        keyboardShortcut="⌘K"
                        type="search"
                        onClick={() => setOpen(true)}
                    />
                )}
            </SimpleTooltip>

            {/* Dialog */}
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                        <CommandItem>Calendar</CommandItem>
                        <CommandItem>Search Emoji</CommandItem>
                        <CommandItem>Calculator</CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
};
export default SearchInput;
