import "./globals.css";
import "simplebar-react/dist/simplebar.min.css";

import { cn, constructMetadata } from "@/lib/utils";

import { Inter } from "next/font/google";
import Navbar from "@/components/nav/Navbar";
import NextThemeProvider from "@/providers/NextThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import TrpcProvider from "@/providers/TrpcProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = constructMetadata();

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
                        <Toaster />
                        <Navbar />
                        {children}
                    </NextThemeProvider>
                </body>
            </TrpcProvider>
        </html>
    );
};

export default RootLayout;
