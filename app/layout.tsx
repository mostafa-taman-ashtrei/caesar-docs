import "./globals.css";
import "simplebar-react/dist/simplebar.min.css";

import { Inter } from "next/font/google";
import type { Metadata } from "next";
import Navbar from "@/components/nav/Navbar";
import NextThemeProvider from "@/providers/NextThemeProvider";
import TrpcProvider from "@/providers/TrpcProvider";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Raven",
    description: "Chat with and manage your documents using the power of A.I",
};

interface RootLayoutProps {
    children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
    return (
        <html lang="en">
            <TrpcProvider>
                <body
                    className={cn(
                        "min-h-screen font-sans antialiased",
                        inter.className
                    )}
                >
                    <NextThemeProvider>
                        <Navbar />
                        {children}
                    </NextThemeProvider>
                </body>
            </TrpcProvider>
        </html>
    );
};

export default RootLayout;
