import { type FileRouter, createUploadthing } from "uploadthing/next";
import { DB } from "@/lib/prisma";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { PLANS } from "@/constants";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { pineconeClient } from "@/lib/pinecone";
import { z } from "zod";

const f = createUploadthing({
    errorFormatter: (err) => {
        return {
            message: err.message,
            zodError:
                err.cause instanceof z.ZodError ? err.cause.flatten() : null,
        };
    },
});

const middleware = async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) throw new Error("Unauthorized");

    const subscriptionPlan = await getUserSubscriptionPlan();
    return { subscriptionPlan, userId: user.id };
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

const freePlanMaxSize = PLANS.find((plan) => plan.name === "Free Forever")!
    .maxDocumentSize.mb as "4MB";
const proPlanMaxSize = PLANS.find((plan) => plan.name === "Pro")!
    .maxDocumentSize.mb as "16MB";

export const ourFileRouter = {
    freePlanUploader: f({ pdf: { maxFileSize: freePlanMaxSize } })
        .middleware(middleware)
        .onUploadComplete(onUploadComplete),
    proPlanUploader: f({ pdf: { maxFileSize: proPlanMaxSize } })
        .middleware(middleware)
        .onUploadComplete(onUploadComplete),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
