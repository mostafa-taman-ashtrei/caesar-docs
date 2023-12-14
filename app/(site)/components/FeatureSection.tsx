import GradientImage from "@/components/general/GradientImage";
import Link from "next/link";

const FeatureSection: React.FC = () => {
    return (
        <>
            <div className="mx-auto mb-32 mt-32 max-w-5xl sm:mt-56">
                <div className="mb-12 px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl sm:text-center">
                        <h2 className="mt-2 text-4xl font-bold sm:text-5xl">
                            Start chatting in minutes
                        </h2>
                        <p className="mt-4 text-lg text-gray-600">
                            Chatting to your PDF files has never been easier
                            than with Quill.
                        </p>
                    </div>
                </div>

                <ol className="my-8 space-y-4 pt-8 md:flex md:space-x-12 md:space-y-0">
                    <li className="md:flex-1">
                        <div className="y-2 flex flex-col space-y-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
                            <span className="text-lg font-medium">
                                Step 1 | Sign up for an account
                            </span>

                            <span className="mt-2 text-zinc-700">
                                Either starting out with a free plan or choose
                                our{" "}
                                <Link
                                    href="/pricing"
                                    className="text-blue-700 underline underline-offset-2"
                                >
                                    pro plan
                                </Link>
                                .
                            </span>
                        </div>
                    </li>

                    <li className="md:flex-1">
                        <div className="flex flex-col space-y-2  py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
                            <span className="text-lg font-medium">
                                Step 2 | Upload your PDF file
                            </span>
                            <span className="mt-2 text-zinc-700">
                                We&apos;ll process your file and make it ready
                                for you to chat with.
                            </span>
                        </div>
                    </li>

                    <li className="md:flex-1">
                        <div className="flex flex-col  space-y-2 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
                            <span className="text-lg font-medium">
                                Step 3 | Start asking questions
                            </span>
                            <span className="mt-2 text-zinc-700">
                                It&apos;s that simple. Try out Quill today - it
                                really takes less than a minute.
                            </span>
                        </div>
                    </li>
                </ol>

                <GradientImage imageUrl="/images/upload-screenshot.jpg" />
            </div>
        </>
    );
};

export default FeatureSection;
