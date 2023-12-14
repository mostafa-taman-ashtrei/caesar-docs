import Image from "next/image";

interface GradientImageProps {
    imageUrl: string;
}

const GradientImage: React.FC<GradientImageProps> = ({ imageUrl }) => {
    return (
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="mt-16 flow-root sm:mt-24">
                <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                    <Image
                        src={imageUrl}
                        alt="product preview"
                        width={1364}
                        height={1866}
                        quality={100}
                        className="rounded-md bg-gradient-to-r gradient-primary p-2 sm:p-8 md:p-10 ring-1 ring-gray-900/10"
                    />
                </div>
            </div>
        </div>
    );
};

export default GradientImage;