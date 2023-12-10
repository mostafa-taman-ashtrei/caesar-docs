import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";

interface ChatProps {
  fileId: string;
}

const Chat: React.FC<ChatProps> = ({ fileId }) => {
  return (
    <div className="relative flex  min-h-full flex-col justify-between gap-2 divide-y divide-zinc-200">
      <div className="mb-20 flex flex-1 flex-col justify-between">
        <ChatMessages fileId={fileId} />
      </div>

      <ChatInput />
    </div>
  );
};

export default Chat;
