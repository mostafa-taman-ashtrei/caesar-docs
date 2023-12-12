"use client";

import { AlertCircle, ChevronLeft, Loader } from "lucide-react";

import { ChatContextProvider } from "@/contexts/Chat/ChatContext";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { trpc } from "@/app/_trpc/client";

interface ChatProps {
    fileId: string;
}

const Chat: React.FC<ChatProps> = ({ fileId }) => {
    const { data, isLoading } = trpc.getFileUploadStatus.useQuery(
        { fileId },
        {
            refetchInterval: (data) =>
                data?.status === "SUCCESS" || data?.status === "FAILED"
                    ? false
                    : 500,
        }
    );

    if (isLoading)
        return (
            <div className="relative flex  min-h-full flex-col justify-between gap-2">
                <div className="mb-28 flex flex-1 flex-col items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                        <Loader className="h-8 w-8 animate-spin text-blue-500" />
                        <h3 className="text-xl font-semibold">Loading ...</h3>
                        <p className="text-sm text-zinc-500">
                            Raven is preparing your document ...
                        </p>
                    </div>
                </div>

                <ChatInput isDisabled />
            </div>
        );

    if (data?.status === "PROCESSING")
        return (
            <div className="relative flex  min-h-full flex-col justify-between gap-2">
                <div className="mb-28 flex flex-1 flex-col items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                        <Loader className="h-8 w-8 animate-spin text-blue-500" />
                        <h3 className="text-xl font-semibold">
                            Processing PDF ...
                        </h3>
                        <p className="text-sm text-zinc-500">
                            Raven is processing your document ... this will only
                            take a moment
                        </p>
                    </div>
                </div>

                <ChatInput isDisabled />
            </div>
        );

    if (data?.status === "FAILED")
        return (
            <div className="relative flex min-h-full flex-col justify-between gap-2">
                <div className="mb-28 flex flex-1 flex-col items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                        <AlertCircle className="h-8 w-8 text-red-500" />
                        <h3 className="text-xl font-semibold">
                            Too many pages in PDF
                        </h3>

                        <Link
                            href="/dashboard"
                            className={buttonVariants({
                                variant: "secondary",
                                className: "mt-4",
                            })}
                        >
                            <ChevronLeft className="mr-1.5 h-3 w-3" />
                            Back To Dashboard
                        </Link>
                    </div>
                </div>

                <ChatInput isDisabled />
            </div>
        );

    return (
        <ChatContextProvider fileId={fileId}>
            <div className="relative flex  min-h-full flex-col justify-between gap-2">
                <div className="mb-20 flex flex-1 flex-col justify-between">
                    <ChatMessages fileId={fileId} />
                </div>

                <ChatInput />
            </div>
        </ChatContextProvider>
    );
};

export default Chat;
