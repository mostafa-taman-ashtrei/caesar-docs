"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import DropZone from "./DropZone";
import { UploadCloud } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";

interface UploadModalProps {}

const UploadModal: React.FC<UploadModalProps> = () => {
    const router = useRouter();

    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const { startUpload } = useUploadThing("freePlanUploader");

    const startSimulatedProgress = () => {
        setUploadProgress(0);

        const interval = setInterval(() => {
            setUploadProgress((prevProgress) => {
                if (prevProgress >= 95) {
                    clearInterval(interval);
                    return prevProgress;
                }
                return prevProgress + 5;
            });
        }, 500);

        return interval;
    };

    const { mutate: startPolling } = trpc.getFile.useMutation({
        onSuccess: (file) => {
            router.push(`/dashboard/${file.id}`);
        },
        retry: true,
        retryDelay: 500,
    });

    const handleUpload = async (acceptedFile: File[]) => {
        setIsUploading(true);

        const progressInterval = startSimulatedProgress();
        const res = await startUpload(acceptedFile);

        if (!res) {
            toast({
                title: "Something went wrong",
                description: "Please try again later",
                variant: "destructive",
            });
            return;
        }

        const [fileResponse] = res;
        const key = fileResponse?.key;

        if (!key) {
            toast({
                title: "Something went wrong",
                description: "Please try again later",
                variant: "destructive",
            });
            return;
        }

        clearInterval(progressInterval);
        setUploadProgress(100);

        startPolling({ key });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="flex w-1/4 flex-row items-center justify-center gap-2">
                    <UploadCloud />
                    Upload
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload a PDF file</DialogTitle>
                </DialogHeader>

                <DropZone
                    isUploading={isUploading}
                    uploadProgress={uploadProgress}
                    handleUpload={handleUpload}
                />
            </DialogContent>
        </Dialog>
    );
};

export default UploadModal;
