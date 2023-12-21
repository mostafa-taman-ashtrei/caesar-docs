"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { cn, readFile } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import DropZone from "./DropZone";
import ErrorZone from "./ErrorZone";
import { FileRejection } from "react-dropzone";
import { UploadCloud } from "lucide-react";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";

interface UploadModalProps {
    subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>;
    className?: string;
    variant: "ghost" | "secondary";
}

const UploadModal: React.FC<UploadModalProps> = ({ subscriptionPlan, className, variant }) => {
    const router = useRouter();
    const { maxDocumentSize, isSubscribed } = subscriptionPlan;

    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const { startUpload } = useUploadThing(
        isSubscribed ? "proPlanUploader" : "freePlanUploader"
    );

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
        const errorMessage =
            fileRejections[0].errors[0].code === "file-too-large"
                ? `Your current plan only supports files up to ${maxDocumentSize?.mb}, upgrade to PRO to get more features.`
                : "There seems to be some abnormalities with this file.";

        setError(errorMessage);
        setUploadProgress(0);
        setIsUploading(false);

        return;
    };

    const handleUpload = async (acceptedFile: File[]) => {
        setIsUploading(true);
        const progressInterval = startSimulatedProgress();

        const pdfPages = await readFile(acceptedFile[0]);
        const pdfPageLimit = subscriptionPlan.pagesPerPdf || 20;


        if (pdfPages === null) {
            setUploadProgress(0);
            setIsUploading(false);
            setError("Failed to process number of pages in this pdf ... please try again later.");
            throw new Error("Failed to process number of pages in this pdf");
        }

        if (pdfPages > pdfPageLimit) {
            setError(`Your current plan only supports files up to ${pdfPageLimit} pages per document, upgrade to PRO to get more features`);
            setUploadProgress(0);
            setIsUploading(false);
            return;
        }


        const res = await startUpload(acceptedFile);

        if (!res) {
            setUploadProgress(0);
            setIsUploading(false);
            setError("Something went wrong ... please try again later.");
            return;
        }

        const [fileResponse] = res;
        const key = fileResponse?.key;

        if (!key) {
            setUploadProgress(0);
            setIsUploading(false);
            setError("Something went wrong ... please try again later.");
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
                    className={cn(
                        "flex w-full flex-row items-center justify-center gap-2 md:w-1/2",
                        className
                    )}
                    variant={variant}
                >
                    <UploadCloud />
                    Upload A New Document
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload a PDF file</DialogTitle>
                </DialogHeader>

                {error ? (
                    <ErrorZone error={error} setError={setError} />
                ) : (
                    <DropZone
                        isUploading={isUploading}
                        uploadProgress={uploadProgress}
                        maxDocumentSize={
                            !maxDocumentSize
                                ? 16_777_216
                                : maxDocumentSize.bytes
                        }
                        handleUpload={handleUpload}
                        handleError={handleError}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
};

export default UploadModal;
