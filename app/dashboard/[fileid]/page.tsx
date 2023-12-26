import { notFound, redirect } from "next/navigation";

import Chat from "./components/Chat/Chat";
import { DB } from "@/lib/prisma";
import PdfViewer from "./components/PdfViewer";
import React from "react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

interface FilePageProps {
    params: {
        fileid: string;
    };
}

const FilePage: React.FC<FilePageProps> = async ({ params }) => {
    const { fileid } = params;

    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) redirect(`/auth-sync?origin=dashboard/${fileid}`);

    const file = await DB.file.findFirst({
        where: { id: fileid, userId: user.id },
    });

    if (!file) notFound();

    return (
        <div className="flex h-[calc(100vh-7.5rem)] flex-1 flex-col justify-between">
            <div className="max-w-8xl mx-auto w-full grow lg:flex xl:px-2">
                <div className="flex-1 xl:flex">
                    <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
                        <PdfViewer fileUrl={file.url} />
                    </div>
                </div>

                <div className="flex-1 shrink-0 border-t border-dashed border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
                    <Chat fileId={file.id} />
                </div>
            </div>
        </div>
    );
};

export default FilePage;
