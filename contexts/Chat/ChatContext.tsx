import { ReactNode, createContext, useRef, useState } from "react";

import { INFINITE_QUERY_LIMIT } from "@/constants";
import { toast } from "@/components/ui/use-toast";
import { trpc } from "@/app/_trpc/client";
import { useMutation } from "@tanstack/react-query";

type StreamResponse = {
    addMessage: () => void;
    message: string;
    // eslint-disable-next-line no-unused-vars
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    isLoading: boolean;
};

export const ChatContext = createContext<StreamResponse>({
    addMessage: () => {},
    message: "",
    handleInputChange: () => {},
    isLoading: false,
});

interface Props {
    fileId: string;
    children: ReactNode;
}

export const ChatContextProvider = ({ fileId, children }: Props) => {
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const utils = trpc.useUtils();

    const backupMessage = useRef("");

    const { mutate: sendMessage } = useMutation({
        mutationFn: async ({ message }: { message: string }) => {
            const response = await fetch("/api/message", {
                method: "POST",
                body: JSON.stringify({ fileId, message }),
            });

            if (!response.ok) throw new Error("Failed to send message");

            return response.body;
        },

        onMutate: async ({ message }) => {
            // ** Create a backup for the message & put it back in case of an error.
            backupMessage.current = message;
            setMessage("");

            // ** Cancel any outgoing requests so there are no overwrites.
            await utils.getFileMessages.cancel();

            // ** Insert the new message right away for instant updates.
            const previousMessages = utils.getFileMessages.getInfiniteData();

            utils.getFileMessages.setInfiniteData(
                { fileId, limit: INFINITE_QUERY_LIMIT },
                (oldData) => {
                    // ** return an empty obj in case of errors.
                    // ** The pages & pageParams are how react-query handles infinte queries.
                    if (!oldData) return { pages: [], pageParams: [] };

                    const newPages = [...oldData.pages];

                    // ** The latest 10 (INFINITE_QUERY_LIMIT) pages.
                    const latestPage = newPages[0]!;

                    latestPage.messages = [
                        {
                            createdAt: new Date().toISOString(),
                            id: crypto.randomUUID(),
                            text: message,
                            isUserMessage: true,
                        },
                        ...latestPage.messages,
                    ];

                    newPages[0] = latestPage;
                    return { ...oldData, pages: newPages };
                }
            );

            setIsLoading(true);
            return {
                previousMessages:
                    previousMessages?.pages.flatMap((page) => page.messages) ??
                    [],
            };
        },

        onSuccess: async (stream) => {
            setIsLoading(false);

            if (!stream)
                return toast({
                    title: "Something went wrong!",
                    description:
                        "There was a problem with this message ... please refresh this page and try again",
                    variant: "destructive",
                });

            const reader = stream.getReader();
            const decoder = new TextDecoder();

            let done = false;
            let accumulatedResponse = "";

            // ** As long as the response is streaming this while loop will run.
            while (!done) {
                const { value, done: doneStreaming } = await reader.read();
                done = doneStreaming;

                const responseChunk = decoder.decode(value);
                accumulatedResponse += responseChunk;

                // ** Append chunk to the AI response message in realtime.
                utils.getFileMessages.setInfiniteData(
                    { fileId, limit: INFINITE_QUERY_LIMIT },
                    (oldData) => {
                        // ** return an empty obj in case of errors.
                        // ** The pages & pageParams are how react-query handles infinte queries.
                        if (!oldData) return { pages: [], pageParams: [] };

                        // ** Is there an AI message or not. If no create one if yes add to the existing message.
                        const aiResponseExists = oldData.pages.some((page) =>
                            page.messages.some(
                                (message) => message.id === "ai-response"
                            )
                        );

                        const updatedPages = oldData.pages.map((page) => {
                            if (page === oldData.pages[0]) {
                                let updatedMessages;

                                if (!aiResponseExists)
                                    updatedMessages = [
                                        {
                                            createdAt: new Date().toISOString(),
                                            id: "ai-response",
                                            text: accumulatedResponse,
                                            isUserMessage: false,
                                        },
                                        ...page.messages,
                                    ];
                                else
                                    updatedMessages = page.messages.map(
                                        (message) => {
                                            if (message.id === "ai-response")
                                                return {
                                                    ...message,
                                                    text: accumulatedResponse,
                                                };
                                            return message;
                                        }
                                    );

                                return { ...page, messages: updatedMessages };
                            }

                            return page;
                        });

                        return { ...oldData, pages: updatedPages };
                    }
                );
            }
        },

        onError: (_, __, context) => {
            // ** If there is an error put the message back in the input.
            setMessage(backupMessage.current);
            utils.getFileMessages.setData(
                { fileId },
                { messages: context?.previousMessages ?? [] }
            );
        },

        onSettled: async () => {
            // ** Clean up after everything is done and refresh the data to get the latest version.
            setIsLoading(false);
            await utils.getFileMessages.invalidate({ fileId });
        },
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setMessage(e.target.value);

    const addMessage = () => sendMessage({ message });

    const contextValues = {
        addMessage,
        message,
        handleInputChange,
        isLoading,
    };

    return (
        <ChatContext.Provider value={contextValues}>
            {children}
        </ChatContext.Provider>
    );
};
