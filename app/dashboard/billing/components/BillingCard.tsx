"use client";

import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import Container from "@/components/general/Container";
import { Loader } from "lucide-react";
import { format } from "date-fns";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { trpc } from "@/app/_trpc/client";
import { useToast } from "@/components/ui/use-toast";

interface BillingCardProps {
    subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>;
}

const BillingCard: React.FC<BillingCardProps> = ({ subscriptionPlan }) => {
    const { toast } = useToast();

    const { mutate: createStripeSession, isLoading } =
        trpc.createStripeSession.useMutation({
            onSuccess: ({ url }) => {
                if (url) window.location.href = url;
                if (!url) {
                    toast({
                        title: "There was a problem...",
                        description: "Please try again in a moment",
                        variant: "destructive",
                    });
                }
            },
        });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createStripeSession();
    };

    return (
        <Container>
            <form className="mt-12" onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Current Subscription Plan</CardTitle>
                        <CardDescription>
                            You are currently on the{" "}
                            <strong>{subscriptionPlan.name}</strong> plan.
                        </CardDescription>
                    </CardHeader>

                    <CardFooter className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0">
                        <Button
                            type="submit"
                            variant={
                                subscriptionPlan.isSubscribed
                                    ? "secondary"
                                    : "gradient"
                            }
                        >
                            {isLoading && (
                                <Loader className="mr-4 h-4 w-4 animate-spin" />
                            )}
                            {subscriptionPlan.isSubscribed
                                ? "Manage Subscription"
                                : "Upgrade to PRO"}
                        </Button>

                        {subscriptionPlan.isSubscribed ? (
                            <p className="rounded-full text-xs font-medium">
                                {subscriptionPlan.isCanceled
                                    ? "Your plan will be canceled on "
                                    : "Your plan renews on "}
                                {format(
                                    subscriptionPlan.stripeCurrentPeriodEnd!,
                                    "dd/MM/yyyy"
                                )}
                                .
                            </p>
                        ) : null}
                    </CardFooter>
                </Card>
            </form>
        </Container>
    );
};

export default BillingCard;
