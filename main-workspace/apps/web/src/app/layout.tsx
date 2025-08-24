import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import type { ReactNode } from "react";
import Providers from "../components/providers";
import "./style/globals.css";

const outfit = Outfit({
    variable: "--font-outfit",
    subsets: ["latin"],
});

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
                url: "https://mc-metrics.rainnny.club/media/logo.png",
                width: 128,
                height: 128,
            },
        ],
    },
    twitter: { card: "summary" },
};
export const viewport: Viewport = { themeColor: "#00AA00" };

const RootLayout = ({
    children,
}: Readonly<{
    children: ReactNode;
}>) => (
    <html lang="en" suppressHydrationWarning>
        <body className={`${outfit.variable} antialiased`}>
            <Providers>{children}</Providers>
        </body>
    </html>
);
export default RootLayout;
