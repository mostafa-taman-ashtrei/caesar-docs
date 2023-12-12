"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import useChat from "@/hooks/useChat";

interface ChatInputProps {
    isDisabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ isDisabled }) => {
    const { addMessage, handleInputChange, isLoading, message } = useChat();

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== "Enter") return;

        e.preventDefault();
        addMessage();
    };

    const handleClickSend = () => addMessage();

    return (
        <div className="absolute bottom-0 left-0 w-full">
            <div className="relative flex h-full flex-1 items-stretch">
                <div className="flex w-full flex-row items-center  justify-center gap-2  p-2">
                    <Input
                        disabled={isLoading || isDisabled}
                        placeholder="Enter your question..."
                        onKeyDown={handleKeyDown}
                        onChange={handleInputChange}
                        value={message}
                    />

                    <Button
                        disabled={isLoading || isDisabled}
                        aria-label="send message"
                        onClick={handleClickSend}
                        variant="secondary"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ChatInput;
