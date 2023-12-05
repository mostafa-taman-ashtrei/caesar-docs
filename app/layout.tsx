import "./globals.css";

import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Owl",
  description: "Chat with your documents using the power of AI",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body
        className={cn(
          "grainy min-h-screen font-sans antialiased",
          inter.className
        )}
      >
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
