import Container from "@/components/general/Container";
import FeatureSection from "./components/FeatureSection";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";

const HomePage: React.FC = () => {
    return (
        <>
            <Container className="mb-12 mt-28 flex flex-col items-center justify-center text-center sm:mt-40">
                <HeroSection />
            </Container>

            <FeatureSection />
            <Footer />
        </>
    );
};

export default HomePage;
