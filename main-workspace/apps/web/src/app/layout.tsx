import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import AppProviders from "../provider/app-providers";
import "./styles/globals.css";

export const metadata: Metadata = {
    title: {
        default: "Minecraft Metrics",
        template: `%s • Minecraft Metrics`,
    },
    description:
        "⛏️ Minecraft Metrics is a tool that allows you to track your Minecraft server metrics.",
    openGraph: {
        images: [
            {
                url: "https://mc-metrics.rainnny.club/media/logo/app.png",
                width: 128,
                height: 128,
            },
        ],
    },
    twitter: { card: "summary" },
};
export const viewport: Viewport = { themeColor: "#00AA00" };

const outfit = Outfit({
    variable: "--font-outfit",
    subsets: ["latin"],
});

const minecraftFont = localFont({
    variable: "--font-minecraft",
    src: "./fonts/Minecraft-Regular.woff2",
});

const RootLayout = ({
    children,
}: Readonly<{
    children: ReactNode;
}>) => (
    <html lang="en" suppressHydrationWarning>
        <body
            className={cn(
                "antialiased select-none",
                outfit.variable,
                minecraftFont.variable
            )}
        >
            <AppProviders>{children}</AppProviders>
        </body>
    </html>
);
export default RootLayout;
