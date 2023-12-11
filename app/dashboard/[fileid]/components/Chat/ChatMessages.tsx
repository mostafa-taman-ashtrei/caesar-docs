import { CheckCircle2, Loader } from "lucide-react";
import { useEffect, useRef } from "react";

import ChatMessagesSkeleton from "@/components/skeletons/ChatMessagesSkeleton";
import { INFINITE_QUERY_LIMIT } from "@/constants";
import Message from "./Message";
import { trpc } from "@/app/_trpc/client";
import useChat from "@/hooks/useChat";
import { useIntersection } from "@mantine/hooks";

interface ChatMessagesProps {
    fileId: string;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ fileId }) => {
    const { isLoading: isAiLoading } = useChat();
    const lastMessageRef = useRef<HTMLDivElement>(null);

    const { data, isLoading, fetchNextPage } =
        trpc.getFileMessages.useInfiniteQuery(
            { fileId, limit: INFINITE_QUERY_LIMIT },
            {
                getNextPageParam: (lastPage) => lastPage?.nextCursor,
                keepPreviousData: true,
            }
        );

    const messages = data?.pages.flatMap((page) => page.messages);

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

    const allMessages = [
        ...(isAiLoading ? [loadingMessage] : []),
        ...(messages ?? []),
    ];

    const isNextMessageSamePerson = (index: number) =>
        allMessages[index - 1]?.isUserMessage ===
        allMessages[index]?.isUserMessage;

    const { ref, entry } = useIntersection({
        root: lastMessageRef.current,
        threshold: 1,
    });

    useEffect(() => {
        if (entry?.isIntersecting) fetchNextPage();
    }, [entry, fetchNextPage]);

    if (isLoading) return <ChatMessagesSkeleton />;

    return (
        <div className="flex max-h-[calc(100vh-3.5rem-7rem)] flex-1 flex-col-reverse gap-4 overflow-y-auto border-zinc-200 p-3">
            {allMessages.length === 0 && !isLoading && (
                <div className="flex flex-1 flex-col items-center justify-center gap-2">
                    <CheckCircle2 className="h-8 w-8 text-blue-500" />
                    <h3 className="text-xl font-semibold">Done</h3>
                    <p className="text-sm text-zinc-500">
                        This is the begging of your document chat, ask a
                        question to get started.
                    </p>
                </div>
            )}

            {allMessages &&
                allMessages.length > 0 &&
                !isLoading &&
                allMessages.map((message, i) => (
                    <Message
                        message={message}
                        isNextMessageSamePerson={isNextMessageSamePerson(i)}
                        key={message.id}
                        ref={i === allMessages.length - 1 ? ref : undefined}
                    />
                ))}
        </div>
    );
};

export default ChatMessages;
