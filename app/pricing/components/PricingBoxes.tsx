"use client";

import { CheckCircle2, HelpCircle, XCircle, Zap } from "lucide-react";
import { PLANS, pricingItems } from "@/constants";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";
import GradientText from "@/components/general/GradientText";
import { cn } from "@/lib/utils";
import { trpc } from "@/app/_trpc/client";

const PricingBoxes: React.FC = () => {
    const getPlanPrice = (plan: string) =>
        PLANS.find((p) => p.slug === plan.toLowerCase())?.price.amount || 0;

    const { mutate: createStripeSession } =
        trpc.createStripeSession.useMutation({
            onSuccess: ({ url }) => {
                window.location.href = url ?? "/dashboard/billing";
            },
        });

    const handleUpgrade = () => createStripeSession();

    return (
        <div className="grid grid-cols-1 gap-10 py-12 lg:grid-cols-2">
            <TooltipProvider>
                {pricingItems.map(({ plan, tagline, features }) => (
                    <div
                        key={plan}
                        className={cn("relative rounded-2xl shadow-lg", {
                            "border-2 border-blue-600": plan === "Pro",
                            "border border-gray-200": plan !== "Pro",
                        })}
                    >
                        {plan === "Pro" && (
                            <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-3 py-2 text-center text-sm font-bold text-white">
                                Upgrade now
                            </div>
                        )}

                        <div className="border-b-2 p-5">
                            <h3 className="font-display my-3 text-center text-3xl font-bold">
                                {plan === "Pro" ? (
                                    <GradientText text="Pro" />
                                ) : (
                                    "Free Forver"
                                )}
                            </h3>

                            <p className="text-center text-gray-500 underline">
                                {tagline}
                            </p>

                            <p className="font-display my-5 text-center text-6xl font-bold">
                                ${getPlanPrice(plan)} / mo
                            </p>
                        </div>

                        <ul className="my-10 space-y-5 px-8">
                            {features.map(({ text, footnote, negative }) => (
                                <li key={text} className="flex space-x-5">
                                    <div className="flex-shrink-0">
                                        {negative ? (
                                            <XCircle className="h-6 w-6 text-red-500" />
                                        ) : (
                                            <CheckCircle2 className="h-6 w-6 text-blue-500" />
                                        )}
                                    </div>

                                    {footnote ? (
                                        <div className="flex items-center space-x-1">
                                            <p
                                                className={cn(
                                                    "text-zinc-500 dark:text-zinc-400",
                                                    { "line-through": negative }
                                                )}
                                            >
                                                {text}
                                            </p>

                                            <Tooltip delayDuration={300}>
                                                <TooltipTrigger className="ml-1.5 cursor-default">
                                                    <HelpCircle className="h-4 w-4 text-gray-500" />
                                                </TooltipTrigger>

                                                <TooltipContent className="w-80 p-2">
                                                    {footnote}
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                    ) : (
                                        <p
                                            className={cn(
                                                "text-zinc-500 dark:text-zinc-400",
                                                { "line-through": negative }
                                            )}
                                        >
                                            {text}
                                        </p>
                                    )}
                                </li>
                            ))}
                        </ul>

                        <div className="p-5">
                            {plan === "Free" ? (
                                <Button className="w-full" variant="secondary">
                                    Get Started For Free
                                </Button>
                            ) : (
                                <Button
                                    className="flex w-full flex-row items-center justify-center gap-2"
                                    variant="gradient"
                                    onClick={handleUpgrade}
                                >
                                    <Zap />
                                    Upgrade To Pro
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </TooltipProvider>
        </div>
    );
};

export default PricingBoxes;
