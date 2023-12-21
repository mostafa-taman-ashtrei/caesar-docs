import { type ClassValue, clsx } from "clsx";
import { Metadata } from "next";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const absoluteUrl = (path: string) => {
    if (typeof window !== "undefined") return path;
    if (process.env.VERCEL_URL)
        return `https://${process.env.VERCEL_URL}${path}`;
    return `http://localhost:${process.env.PORT ?? 3000}${path}`;
};


type ConstructMetadataParams = {
    title?: string
    description?: string
    image?: string
    icons?: string
    noIndex?: boolean
}

export const constructMetadata = ({
    title = "Raven | MVP",
    description = "Chat with and manage your documents using the power of A.I.",
    image = "/images/placeholder-thumbnail.jpg",
    icons = "/favicon.ico",
    noIndex = false
}: ConstructMetadataParams = {}): Metadata => {
    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [
                {
                    url: image
                }
            ]
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [image],
            creator: "@appnamehandle" // TODO: app twitter handle goes here.
        },
        icons,
        metadataBase: new URL("https://production-url.com"), // TODO: production url goes here
        ...(noIndex && {
            robots: {
                index: false,
                follow: false
            }
        })
    };
};


export const readFile = (file: File) => {
    return new Promise<number | null>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsText(file);

        reader.onload = () => {
            const fileResult = reader.result as string;
            const pdfPages = fileResult.match(/\/Type[\s]*\/Page[^s]/g);
            if (pdfPages === null) return reject("Failed to get page num");

            return resolve(pdfPages.length);
        };

        reader.onerror = error => reject(error);
    });
};