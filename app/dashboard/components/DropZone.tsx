import { File, Loader2, UploadCloud } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import ReactDropzone from "react-dropzone";

interface DropZoneProps {
    isUploading: boolean;
    uploadProgress: number;
    // eslint-disable-next-line no-unused-vars
    handleUpload: (acceptedFile: File[]) => Promise<void>;
}

const DropZone: React.FC<DropZoneProps> = ({
    isUploading,
    uploadProgress,
    handleUpload,
}) => {
    return (
        <ReactDropzone
            multiple={false}
            onDrop={(acceptedFiles) => handleUpload(acceptedFiles)}
            noClick
        >
            {({ getRootProps, getInputProps, acceptedFiles }) => (
                <div
                    {...getRootProps()}
                    className="m-4 h-72 rounded-lg border  border-dashed border-gray-300"
                >
                    <div className="flex h-full w-full items-center justify-center">
                        <label
                            htmlFor="dropzone-file"
                            className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg"
                        >
                            <div className="flex flex-col items-center justify-center pb-6 pt-5">
                                <UploadCloud className="mb-2 h-14 w-14 text-zinc-500" />
                                <p className="mb-2 text-sm text-zinc-700">
                                    <span className="font-semibold">
                                        Click to upload
                                    </span>{" "}
                                    or drag and drop your file here
                                </p>
                            </div>

                            {acceptedFiles && acceptedFiles[0] ? (
                                <div className="flex  max-w-xs items-center divide-x divide-zinc-200 overflow-hidden rounded-md outline outline-[1px] outline-zinc-200">
                                    <div className="grid h-full place-items-center px-3 py-2">
                                        <File className="h-4 w-4 text-blue-500" />
                                    </div>
                                    <div className="h-full truncate px-3 py-2 text-sm">
                                        {acceptedFiles[0].name}
                                    </div>
                                </div>
                            ) : null}

                            {isUploading && (
                                <div className="mx-auto mt-4 w-full max-w-xs">
                                    <Progress
                                        indicatorColor={
                                            uploadProgress === 100
                                                ? "bg-green-500"
                                                : ""
                                        }
                                        value={uploadProgress}
                                        className="h-2 w-full"
                                    />

                                    {uploadProgress === 100 && (
                                        <div className="flex items-center justify-center gap-1 pt-2  text-center text-sm">
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                            Generating PDF page...
                                        </div>
                                    )}
                                </div>
                            )}

                            <input
                                {...getInputProps({ disabled: isUploading })}
                                type="file"
                                id="dropzone-file"
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>
            )}
        </ReactDropzone>
    );
};

export default DropZone;
