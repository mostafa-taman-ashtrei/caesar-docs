import { ChatContext } from "@/contexts/Chat/ChatContext";
import { useContext } from "react";

const useChat = () => useContext(ChatContext);

export default useChat;
