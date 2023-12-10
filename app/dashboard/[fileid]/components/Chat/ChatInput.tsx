"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useRef } from "react";

interface ChatInputProps {
    isDisabled?: boolean
}

const ChatInput: React.FC<ChatInputProps> = ({ isDisabled }) => {
    const textareaRef = useRef(null);

    return (
        <div className="absolute bottom-0 left-0 w-full">
            <div className="relative flex h-full flex-1 items-stretch">
                <div className="flex flex-row justify-center items-center  gap-2 w-full  p-2">
                    <Input
                        ref={textareaRef}
                        autoFocus
                        placeholder="Enter your question..."

                    />

                    <Button
                        disabled={isDisabled}
                        className="rounded-md"
                        aria-label="send message"

                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ChatInput;