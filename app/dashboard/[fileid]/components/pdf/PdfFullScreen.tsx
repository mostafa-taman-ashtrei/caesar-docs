import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Document, Page } from "react-pdf";
import { Expand, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import SimpleBar from "simplebar-react";
import { useResizeDetector } from "react-resize-detector";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface PdfFullScreenProps {
    fileUrl: string;
}

const PdfFullScreen = ({ fileUrl }: PdfFullScreenProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [numPages, setNumPages] = useState<number>();

    const { toast } = useToast();
    const { width, ref } = useResizeDetector();

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(v) => {
                if (!v) setIsOpen(v);
            }}
        >
            <DialogTrigger onClick={() => setIsOpen(true)} asChild>
                <Button
                    variant="ghost"
                    className="gap-1.5"
                    aria-label="fullscreen"
                    size="icon"
                >
                    <Expand className="h-4 w-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="m-0 h-full w-full max-w-full rounded-none p-0">
                <SimpleBar autoHide={false} className="max-h-[100vh] ">
                    <div ref={ref}>
                        <Document
                            loading={
                                <div className="flex justify-center">
                                    <Loader2 className="my-24 h-6 w-6 animate-spin" />
                                </div>
                            }
                            onLoadError={() => {
                                toast({
                                    title: "Error loading PDF",
                                    description: "Please try again later",
                                    variant: "destructive",
                                });
                            }}
                            onLoadSuccess={({ numPages }) =>
                                setNumPages(numPages)
                            }
                            file={fileUrl}
                            className="max-h-full"
                        >
                            {new Array(numPages).fill(0).map((_, i) => (
                                <Page
                                    key={i}
                                    width={width ? width : 1}
                                    pageNumber={i + 1}
                                />
                            ))}
                        </Document>
                    </div>
                </SimpleBar>
            </DialogContent>
        </Dialog>
    );
};

export default PdfFullScreen;
