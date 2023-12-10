import { Bot, Loader } from "lucide-react";

import Message from "./Message";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatMessagesProps {
    fileId: string
}

const ChatMessages: React.FC<ChatMessagesProps> = () => {
    const isLoading = false;

    const loadingMessage = {
        createdAt: new Date().toISOString(),
        id: "loading-message",
        isUserMessage: false,
        text: (
            <span className="flex h-full items-center justify-center">
                <Loader className="h-4 w-4 animate-spin" />
            </span>
        ),
    };

    const dummyMessage = {
        createdAt: new Date().toISOString(),
        id: "dummy-message",
        isUserMessage: true,
        text: "Hi there ... What can you tell me about this document?",
    };

    const dummyBotMessage = {
        createdAt: new Date().toISOString(),
        id: "dummy-bot-message",
        isUserMessage: false,
        text: "How can I help you today?",
    };

    const allMessages = [loadingMessage, dummyMessage, dummyBotMessage];

    const isNextMessageSamePerson = (index: number) => allMessages[index - 1]?.isUserMessage === allMessages[index]?.isUserMessage;

    if (isLoading) return <div className="flex max-h-[calc(100vh-3.5rem-7rem)] flex-1 flex-col-reverse p-3">
        <div className="w-full flex flex-col gap-2">
            <Skeleton className="h-8" />
            <Skeleton className="h-8" />
            <Skeleton className="h-8" />
            <Skeleton className="h-8" />
            <Skeleton className="h-8" />
            <Skeleton className="h-8" />
        </div>
    </div>;

    return (
        <div className="flex max-h-[calc(100vh-3.5rem-7rem)] border-zinc-200 flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
            {
                allMessages.length === 0 && !isLoading && <div className="flex-1 flex flex-col items-center justify-center gap-2">
                    <Bot className="h-8 w-8 text-blue-500" />
                    <h3 className="font-semibold text-xl">
                        You&apos;re all set!
                    </h3>
                    <p className="text-zinc-500 text-sm">
                        This is the begging of your document chat, ask a question to get started.
                    </p>
                </div>
            }

            {
                allMessages && allMessages.length > 0 && !isLoading && (
                    allMessages.map((message, i) => <Message
                        message={message}
                        isNextMessageSamePerson={isNextMessageSamePerson(i)}
                        key={message.id}
                    />)
                )
            }
        </div>
    );
};

export default ChatMessages;