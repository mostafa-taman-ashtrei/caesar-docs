import { Skeleton } from "../ui/skeleton";

const FileSkeleton = () => {
    return (
        <div className="mb-2 mt-8 grid grid-cols-1 gap-6 divide-y md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
        </div>
    );
};

export default FileSkeleton;
