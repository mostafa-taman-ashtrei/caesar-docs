import { Bot, User } from "lucide-react";

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
        const Icons = {
            user: User,
            logo: Bot,
        };

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
                        <Icons.user className=" h-4/5 w-4/5 text-green-500" />
                    ) : (
                        <Icons.logo className=" h-4/5 w-4/5 text-blue-500" />
                    )}
                </div>

                <div
                    className={cn(
                        "mx-2 flex max-w-md flex-col space-y-2 text-base",
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
                                    "mt-2 w-full select-none text-right text-xs",
                                    {
                                        "text-blue-200": !message.isUserMessage,
                                        "text-green-200": message.isUserMessage,
                                    }
                                )}
                            >
                                {format(new Date(message.createdAt), "HH:mm")}
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
