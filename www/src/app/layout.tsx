import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import { ThemeProvider } from "../provider/theme-provider";
import "./style/globals.css";

const inter = Inter({
    variable: "--font-inter",
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
        <body className={`${inter.variable} antialiased`}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                {children}
            </ThemeProvider>
        </body>
    </html>
);
export default RootLayout;
