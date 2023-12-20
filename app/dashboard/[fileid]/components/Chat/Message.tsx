import { Bot, UserRound } from "lucide-react";

import { ExtendedMessage } from "@/types/message";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { forwardRef } from "react";

interface MessageProps {
    message: ExtendedMessage;
    isNextMessageSamePerson: boolean;
}

const Message = forwardRef<HTMLDivElement, MessageProps>(
    ({ message, isNextMessageSamePerson }, ref) => {
        return (
            <div
                ref={ref}
                className={cn("flex items-end", {
                    "justify-end": message.isUserMessage,
                })}
            >
                <div
                    className={cn(
                        "relative flex aspect-square h-7 w-7 items-center justify-center",
                        {
                            "order-2 rounded-full": message.isUserMessage,
                            "order-1 rounded-full": !message.isUserMessage,
                            invisible: isNextMessageSamePerson,
                        }
                    )}
                >
                    {message.isUserMessage ? (
                        <UserRound className=" h-7 w-7 text-green-500" />
                    ) : (
                        <Bot className=" h-7 w-7 text-blue-500" />
                    )}
                </div>

                <div
                    className={cn(
                        "mx-2 flex max-w-md flex-col space-y-2 text-sm",
                        {
                            "order-1 items-end": message.isUserMessage,
                            "order-2 items-start": !message.isUserMessage,
                        }
                    )}
                >
                    <div
                        className={cn("inline-block rounded-lg px-4 py-2", {
                            "bg-green-600 text-white": message.isUserMessage,
                            "bg-blue-600 text-white": !message.isUserMessage,
                            "rounded-br-none":
                                !isNextMessageSamePerson &&
                                message.isUserMessage,
                            "rounded-bl-none":
                                !isNextMessageSamePerson &&
                                !message.isUserMessage,
                        })}
                    >
                        {typeof message.text === "string" ? (
                            <ReactMarkdown
                                className={cn("prose", {
                                    "text-zinc-50": message.isUserMessage,
                                })}
                            >
                                {message.text}
                            </ReactMarkdown>
                        ) : (
                            message.text
                        )}

                        {message.id !== "loading-message" && (
                            <div
                                className={cn(
                                    "mt-2 w-full select-none text-xs",
                                    {
                                        "text-blue-200 text-left": !message.isUserMessage,
                                        "text-green-200 text-right": message.isUserMessage,
                                    }
                                )}
                            >
                                {format(new Date(message.createdAt), "hh:mm a")}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
);

Message.displayName = "Message";

export default Message;
