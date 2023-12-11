import { Skeleton } from "../ui/skeleton";

const ChatMessagesSkeleton: React.FC = () => {
    return (
        <div className="flex max-h-[calc(100vh-3.5rem-7rem)] flex-1 flex-col-reverse p-3">
            <div className="flex w-full flex-col gap-2">
                <div className="flex flex-row justify-end"><Skeleton className="h-8 w-1/2" /></div>
                <div className="flex flex-row justify-end"><Skeleton className="h-8 w-1/2" /></div>
                <Skeleton className="h-8" />
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-8" />
                <Skeleton className="h-8 w-1/2" />
                <div className="flex flex-row justify-end"><Skeleton className="h-8 w-1/2" /></div>
                <Skeleton className="h-8" />
            </div>
        </div>
    );
};

export default ChatMessagesSkeleton;