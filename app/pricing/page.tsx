import Container from "@/components/general/Container";
import PricingBoxes from "./components/PricingBoxes";

const PricingPage = () => {
    return (
        <Container>
            <div className="mx-auto my-10 text-center sm:max-w-lg">
                <h1 className="text-6xl font-bold sm:text-7xl">Pricing</h1>
                <p className="mt-5 text-gray-500 sm:text-lg">
                    Whether you&apos;re just trying out our service or need
                    more, we&apos;ve got you covered. You can get start right
                    away for free or upgrade to Pro and unlock many featues.
                </p>
            </div>

            <PricingBoxes />
        </Container>
    );
};

export default PricingPage;
