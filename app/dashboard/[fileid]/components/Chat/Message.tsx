import { Bot, User } from "lucide-react";

import { ExtendedMessage } from "@/types/message";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { forwardRef } from "react";

interface MessageProps {
    message: ExtendedMessage
    isNextMessageSamePerson: boolean
}

const Message = forwardRef<HTMLDivElement, MessageProps>(({ message, isNextMessageSamePerson }, ref) => {
    const Icons = {
        user: User,
        logo: Bot
    };

    return (
        <div
            ref={ref}
            className={cn("flex items-end", { "justify-end": message.isUserMessage, })}
        >
            <div
                className={cn(
                    "relative flex h-7 w-7 aspect-square items-center justify-center",
                    {
                        "order-2 rounded-full": message.isUserMessage,
                        "order-1 rounded-full": !message.isUserMessage,
                        invisible: isNextMessageSamePerson,
                    }
                )}
            >
                {
                    message.isUserMessage
                        ? <Icons.user className=" text-green-500 h-4/5 w-4/5" />
                        : <Icons.logo className=" text-blue-500 h-4/5 w-4/5" />
                }
            </div>

            <div
                className={cn(
                    "flex flex-col space-y-2 text-base max-w-md mx-2",
                    {
                        "order-1 items-end": message.isUserMessage,
                        "order-2 items-start": !message.isUserMessage,
                    }
                )}
            >
                <div
                    className={cn(
                        "px-4 py-2 rounded-lg inline-block",
                        {
                            "bg-green-600 text-white": message.isUserMessage,
                            "bg-blue-600 text-white": !message.isUserMessage,
                            "rounded-br-none": !isNextMessageSamePerson && message.isUserMessage,
                            "rounded-bl-none": !isNextMessageSamePerson && !message.isUserMessage,
                        }
                    )}
                >
                    {
                        typeof message.text === "string"
                            ? <ReactMarkdown className={cn("prose", { "text-zinc-50": message.isUserMessage })}>
                                {message.text}
                            </ReactMarkdown>
                            : message.text
                    }

                    {
                        message.id !== "loading-message" && <div
                            className={cn(
                                "text-xs select-none mt-2 w-full text-right",
                                {
                                    "text-blue-200": !message.isUserMessage,
                                    "text-green-200": message.isUserMessage,
                                }
                            )}
                        >
                            {format(new Date(message.createdAt), "HH:mm")}
                        </div>
                    }
                </div>

            </div>
        </div>
    );
}
);

Message.displayName = "Message";

export default Message;