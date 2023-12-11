import { type FileRouter, createUploadthing } from "uploadthing/next";
import { DB } from "@/lib/prisma";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { pineconeClient } from "@/lib/pinecone";

const f = createUploadthing();

const middleware = async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) throw new Error("Unauthorized");
    return { userId: user.id };
};

type UploadCompleteProps = {
    metadata: Awaited<ReturnType<typeof middleware>>;
    file: {
        key: string;
        name: string;
        url: string;
    };
};

const onUploadComplete = async ({ metadata, file }: UploadCompleteProps) => {
    const fileExists = await DB.file.findFirst({
        where: { key: file.key },
    });

    if (fileExists) return;

    const createdFile = await DB.file.create({
        data: {
            key: file.key,
            name: file.name,
            userId: metadata.userId,
            url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
            uploadStatus: "PROCESSING",
        },
    });

    try {
        const response = await fetch(
            `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`
        );

        const blob = await response.blob();
        const loader = new PDFLoader(blob);
        const pageLevelDocs = await loader.load();

        // ** vectorize and index the pdf document

        const pineconeIndex = pineconeClient.Index(process.env.PINECONE_INDEX!);
        const embeddings = new OpenAIEmbeddings({
            openAIApiKey: process.env.OPENAI_API_KEY,
        });

        await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
            pineconeIndex,
            namespace: createdFile.id,
        });

        await DB.file.update({
            data: { uploadStatus: "SUCCESS" },
            where: { id: createdFile.id },
        });
    } catch (error) {
        await DB.file.update({
            data: { uploadStatus: "FAILED" },
            where: { id: createdFile.id },
        });

        throw new Error(`Failed to process ${file.name}`);
    }
};

export const ourFileRouter = {
    freePlanUploader: f({ pdf: { maxFileSize: "4MB" } })
        .middleware(middleware)
        .onUploadComplete(onUploadComplete),
    proPlanUploader: f({ pdf: { maxFileSize: "16MB" } })
        .middleware(middleware)
        .onUploadComplete(onUploadComplete),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
