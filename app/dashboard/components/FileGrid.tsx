"use client";

import { Calendar, FileText, Ghost, MessageCircle, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { trpc } from "@/app/_trpc/client";

const FileGrid: React.FC = () => {
    const { data: files, isLoading } = trpc.getUserFiles.useQuery();

    if (isLoading) return <Skeleton className="h-80 w-full mt-8 mb-2" />;

    if (!files || files.length === 0) return <div className="mt-16 flex flex-col items-center gap-2">
        <Ghost className="h-14 w-14" />
        <h3 className="font-semibold text-xl">
            It&apos;s a ghost town in here
        </h3>
        <p>You have no files so start uploading now.</p>
    </div>;


    return (
        <ul className="mt-8 mb-2 grid grid-cols-1 gap-6 divide-y  md:grid-cols-2 lg:grid-cols-3">
            {
                files?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((file) => <li
                    className="col-span-1 divide-y divide-gray-400 dark:divide-black rounded-lg bg-gray-300 dark:bg-zinc-900 transition hover:scale-105 cursor-pointer"
                    key={file.id}
                >
                    <Link
                        href={`/dashboard/${file.id}`}
                        className="flex flex-col gap-1">
                        <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
                            <div className="h-10 w-10 flex-shrink-0 flex justify-center items-center text-white rounded-lg bg-gradient-to-r from-violet-900 to-blue-500">
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

                    <div className="flex flex-row justify-between items-center px-2 mt-4 py-2  text-xs text-zinc-500">
                        <div className="flex flex-row items-center justify-center gap-4">
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {format(new Date(file.createdAt), "MMM yyyy")}
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
                        >
                            <Trash className="h-4 w-4" />
                        </Button>
                    </div>
                </li>
                )
            }
        </ul>
    );
};

export default FileGrid;