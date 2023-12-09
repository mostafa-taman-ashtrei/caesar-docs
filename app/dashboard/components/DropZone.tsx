import { File, Loader2, UploadCloud } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import ReactDropzone from "react-dropzone";

interface DropZoneProps {
    isUploading: boolean;
    uploadProgress: number;
    // eslint-disable-next-line no-unused-vars
    handleUpload: (acceptedFile: File[]) => Promise<void>;
}

const DropZone: React.FC<DropZoneProps> = ({ isUploading, uploadProgress, handleUpload }) => {
    return (
        <ReactDropzone
            multiple={false}
            onDrop={(acceptedFiles) => handleUpload(acceptedFiles)}
            noClick
        >
            {({ getRootProps, getInputProps, acceptedFiles }) => (
                <div
                    {...getRootProps()}
                    className="border h-72 m-4 border-dashed  border-gray-300 rounded-lg">
                    <div className="flex items-center justify-center h-full w-full">
                        <label
                            htmlFor="dropzone-file"
                            className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <UploadCloud className="h-14 w-14 text-zinc-500 mb-2" />
                                <p className="mb-2 text-sm text-zinc-700">
                                    <span className="font-semibold">
                                        Click to upload
                                    </span>{" "}
                                    or drag and drop your file here
                                </p>

                            </div>

                            {acceptedFiles && acceptedFiles[0] ? (
                                <div className="max-w-xs  flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200">
                                    <div className="px-3 py-2 h-full grid place-items-center">
                                        <File className="h-4 w-4 text-blue-500" />
                                    </div>
                                    <div className="px-3 py-2 h-full text-sm truncate">
                                        {acceptedFiles[0].name}
                                    </div>
                                </div>
                            ) : null}

                            {isUploading && <div className="w-full mt-4 max-w-xs mx-auto">
                                <Progress
                                    indicatorColor={uploadProgress === 100 ? "bg-green-500" : ""}
                                    value={uploadProgress}
                                    className="h-2 w-full"
                                />

                                {uploadProgress === 100 && <div className="flex gap-1 items-center justify-center text-sm  text-center pt-2">
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                    Generating PDF page...
                                </div>
                                }
                            </div>
                            }

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