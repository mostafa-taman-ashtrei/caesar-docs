"use client";

import { Calendar, FileText, Ghost, MessageCircle, Trash } from "lucide-react";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { trpc } from "@/app/_trpc/client";

const FileGrid: React.FC = () => {
    const [deletingFile, setDeletingFile] = useState<string | null>(null);

    const utils = trpc.useUtils();

    const { data: files, isLoading } = trpc.getUserFiles.useQuery();

    const { mutate: deleteFile } = trpc.deleteFile.useMutation({
        onSuccess: () => {
            utils.getUserFiles.invalidate();
        },
        onMutate({ id }) {
            setDeletingFile(id);
        },
        onSettled() {
            setDeletingFile(null);
        },
    });

    if (isLoading) return <Skeleton className="mb-2 mt-8 h-80 w-full" />;

    if (!files || files.length === 0)
        return (
            <div className="mt-16 flex flex-col items-center gap-0">
                <Ghost className="h-14 w-14" />
                <h3 className="text-xl font-semibold">
                    It&apos;s a ghost town in here
                </h3>

                <p className="text-sm text-gray-600">
                    You have no files so start uploading now.
                </p>
            </div>
        );

    return (
        <ul className="mb-2 mt-8 grid grid-cols-1 gap-6 divide-y  md:grid-cols-2 lg:grid-cols-3">
            {files
                ?.sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                )
                .map((file) => (
                    <li
                        className={cn(
                            "col-span-1 divide-y divide-gray-400 rounded-lg bg-gray-300 transition dark:divide-black dark:bg-zinc-900",
                            deletingFile === file.id
                                ? "cursor-not-allowed"
                                : "cursor-pointer hover:scale-105"
                        )}
                        key={file.id}
                    >
                        <Link
                            href={`/dashboard/${file.id}`}
                            className={cn(
                                "flex flex-col gap-1",
                                deletingFile === file.id
                                    ? "cursor-not-allowed"
                                    : ""
                            )}
                        >
                            <div className="flex w-full items-center justify-between space-x-6 px-6 pt-6">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-violet-900 to-blue-500 text-white">
                                    <FileText />
                                </div>

                                <div className="flex-1 truncate">
                                    <div className="flex items-center space-x-3">
                                        <h3 className="truncate text-lg font-medium">
                                            {file.name}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <div className="mt-4 flex flex-row items-center justify-between px-2 py-2  text-xs text-zinc-500">
                            <div className="flex flex-row items-center justify-center gap-4">
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {format(
                                        new Date(file.createdAt),
                                        "MMM yyyy"
                                    )}
                                </div>

                                <div className="flex items-center gap-1">
                                    <MessageCircle className="h-4 w-4" />
                                    10
                                </div>
                            </div>

                            <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-500 hover:text-red-600"
                                onClick={() => deleteFile({ id: file.id })}
                                disabled={deletingFile === file.id}
                            >
                                <Trash
                                    className={cn(
                                        "h-4 w-4",
                                        deletingFile === file.id
                                            ? "animate-bounce"
                                            : ""
                                    )}
                                />
                            </Button>
                        </div>
                    </li>
                ))}
        </ul>
    );
};

export default FileGrid;
