import { OpenAIStream, StreamingTextResponse } from "ai";

import { DB } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { SendMessageRouteValidator } from "./validator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { openai } from "@/lib/openAi";
import { pineconeClient } from "@/lib/pinecone";

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();

        const { getUser } = getKindeServerSession();
        const user = await getUser();

        if (user === null || !user.id)
            return new Response("Unauthorized", { status: 401 });

        const { id: userId } = user;
        const { fileId, message } = SendMessageRouteValidator.parse(body);

        const file = await DB.file.findFirst({
            where: { id: fileId, userId },
        });

        if (!file) return new Response("Not found", { status: 404 });

        await DB.message.create({
            data: {
                text: message,
                isUserMessage: true,
                userId,
                fileId,
            },
        });

        // ** Vectorize the user  message
        const embeddings = new OpenAIEmbeddings({
            openAIApiKey: process.env.OPENAI_API_KEY,
        });
        const pineconeIndex = pineconeClient.Index(process.env.PINECONE_INDEX!);

        const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
            pineconeIndex,
            namespace: file.id,
        });

        // TODO: Increase the number 4 for pro users.
        const results = await vectorStore.similaritySearch(message, 4);

        const prevMessages = await DB.message.findMany({
            where: { fileId },
            orderBy: { createdAt: "asc" },
            take: 6,
        });

        const formattedPrevMessages = prevMessages.map((msg) => ({
            role: msg.isUserMessage
                ? ("user" as const)
                : ("assistant" as const),
            content: msg.text,
        }));

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            temperature: 0,
            stream: true,
            messages: [
                {
                    role: "system",
                    content:
                        "Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.",
                },
                {
                    role: "user",
                    content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.

                \n----------------\n

                PREVIOUS CONVERSATION:
                ${formattedPrevMessages.map((message) => {
                    if (message.role === "user")
                        return `User: ${message.content}\n`;
                    return `Assistant: ${message.content}\n`;
                })}

                \n----------------\n

                CONTEXT:
                ${results.map((r) => r.pageContent).join("\n\n")}

                USER INPUT: ${message}`,
                },
            ],
        });

        const stream = OpenAIStream(response, {
            async onCompletion(completion) {
                await DB.message.create({
                    data: {
                        text: completion,
                        isUserMessage: false,
                        fileId,
                        userId,
                    },
                });
            },
        });

        return new StreamingTextResponse(stream);
    } catch (error) {
        throw new Error("Failed to send message");
    }
};
