"use client";

import { ArrowRight } from "lucide-react";
import GradientImage from "@/components/general/GradientImage";
import GradientText from "@/components/general/GradientText";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs";
import { buttonVariants } from "@/components/ui/button";

const HeroSection: React.FC = () => {
    return (
        <>
            <div className="mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 px-7 py-2  backdrop-blur transition-all hover:border-gray-300">
                <p className="text-sm font-semibold">
                    Caesar Docs is now online 🎉
                </p>
            </div>
            <h1 className="max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl">
                Chat with your <GradientText text="documents" /> in seconds.
            </h1>
            <p className="mt-5 max-w-prose text-zinc-700 sm:text-lg">
                Caesar Docs allows you to have conversations with any PDF
                document. Simply upload your file and start asking questions
                right away.
            </p>

            <RegisterLink
                className={buttonVariants({
                    size: "default",
                    variant: "gradient",
                    className: "mt-5 w-1/2 font-bold",
                })}
            >
                Get started <ArrowRight className="ml-1.5 h-5 w-5" />
            </RegisterLink>

            <div className="relative isolate">
                <GradientImage imageUrl="/images/chat-page-screenshot.jpg" />
            </div>
        </>
    );
};

export default HeroSection;
