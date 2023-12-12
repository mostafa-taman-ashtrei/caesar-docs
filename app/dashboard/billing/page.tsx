import BillingCard from "./components/BillingCard";
import Container from "@/components/general/Container";
import { getUserSubscriptionPlan } from "@/lib/stripe";

const BillingPage: React.FC = async () => {
    const subscriptionPlan = await getUserSubscriptionPlan();

    return (
        <Container>
            <div className="mx-auto my-10 text-start sm:max-w-lg">
                <h1 className="text-center text-6xl font-bold sm:text-7xl">
                    Billing
                </h1>
                <p className="mt-5 text-gray-500 sm:text-lg">
                    Manage all your free and Pro plans ... remeber you can
                    always cancel your scubscription at any time.
                </p>
            </div>

            <BillingCard subscriptionPlan={subscriptionPlan} />
        </Container>
    );
};

export default BillingPage;
