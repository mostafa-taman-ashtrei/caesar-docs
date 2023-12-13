import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

interface ErrorZoneProps {
    error: string | null;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const ErrorZone: React.FC<ErrorZoneProps> = ({ error, setError }) => {
    const handleClearError = () => setError(null);

    return (
        <div className="m-4 h-72 rounded-lg border  border-dashed border-gray-300">
            <div className="flex h-full w-full items-center justify-center">
                <div className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg">
                    <div className="flex flex-col items-center justify-center pb-6 pt-5">
                        <XCircle className="mb-2 h-14 w-14 text-red-500" />
                        <p className="mb-2 text-sm">
                            Failed to Upload Your File.
                        </p>
                        <p className="mb-2 text-center text-sm  text-zinc-700">
                            {error}
                        </p>

                        <Button onClick={handleClearError} variant="secondary">
                            Try Another file.
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErrorZone;
