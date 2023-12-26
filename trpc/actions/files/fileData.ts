import { DB } from "@/lib/prisma";
import { INFINITE_QUERY_LIMIT } from "@/constants";
import { TRPCError } from "@trpc/server";
import { UTApi } from "uploadthing/server";
import { privateProcedure } from "@/trpc/trpc";
import { z } from "zod";

export const getFile = privateProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
        const { userId } = ctx;

        const file = await DB.file.findFirst({
            where: { key: input.key, userId },
        });

        if (!file) throw new TRPCError({ code: "NOT_FOUND" });
        return file;
    });


export const deleteFile = privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
        const { userId } = ctx;

        const file = await DB.file.findFirst({
            where: { id: input.id, userId },
        });
        if (!file) throw new TRPCError({ code: "NOT_FOUND" });

        const utapi = new UTApi();
        const fileName = file.url.substring(file.url.lastIndexOf("/") + 1);

        const uploadThingRes = await utapi.deleteFiles(fileName);
        if (uploadThingRes.success)
            await DB.file.delete({ where: { id: input.id } });

        return file;
    });


export const getFileUploadStatus = privateProcedure
    .input(z.object({ fileId: z.string() }))
    .query(async ({ input, ctx }) => {
        const file = await DB.file.findFirst({
            where: {
                id: input.fileId,
                userId: ctx.userId,
            },
        });

        if (!file) return { status: "PENDING" as const };
        return { status: file.uploadStatus };
    });


export const getFileMessages = privateProcedure
    .input(
        z.object({
            limit: z.number().min(1).max(100).nullish(),
            cursor: z.string().nullish(),
            fileId: z.string(),
        })
    )
    .query(async ({ ctx, input }) => {
        const { userId } = ctx;
        const { fileId, cursor } = input;
        const limit = input.limit ?? INFINITE_QUERY_LIMIT;

        const file = await DB.file.findFirst({
            where: { id: fileId, userId },
        });

        if (!file) throw new TRPCError({ code: "NOT_FOUND" });

        const messages = await DB.message.findMany({
            take: limit + 1,
            where: { fileId },
            orderBy: { createdAt: "desc" },
            cursor: cursor ? { id: cursor } : undefined,
            select: {
                id: true,
                isUserMessage: true,
                createdAt: true,
                text: true,
            },
        });

        let nextCursor: typeof cursor | undefined = undefined;

        if (messages.length > limit) {
            const nextItem = messages.pop();
            nextCursor = nextItem?.id;
        }

        return { messages, nextCursor };
    });