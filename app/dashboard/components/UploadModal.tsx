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
import { FileRejection } from "react-dropzone";
import { UploadCloud } from "lucide-react";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { toast } from "@/components/ui/use-toast";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";

interface UploadModalProps {
    subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>
}

const UploadModal: React.FC<UploadModalProps> = ({ subscriptionPlan }) => {
    const router = useRouter();
    const { maxDocumentSize, isSubscribed } = subscriptionPlan;

    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const { startUpload } = useUploadThing(isSubscribed ? "proPlanUploader" : "freePlanUploader");


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

    const handleError = (fileRejections: FileRejection[]) => {
        setError(`${fileRejections[0].errors[0].message} ... Upgrade to Pro to upload larger files.`);
        setUploadProgress(0);
        setIsUploading(false);

        return;
    };

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
                <Button
                    className="flex w-1/4 flex-row items-center justify-center gap-2"
                    variant="secondary"
                >
                    <UploadCloud />
                    Upload New Document
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload a PDF file</DialogTitle>
                </DialogHeader>

                {
                    error
                        ? <p>{error}</p>
                        : <DropZone
                            isUploading={isUploading}
                            uploadProgress={uploadProgress}
                            maxDocumentSize={!maxDocumentSize ? 16_777_216 : maxDocumentSize.bytes}
                            handleUpload={handleUpload}
                            handleError={handleError}
                        />
                }
            </DialogContent>
        </Dialog>
    );
};

export default UploadModal;
