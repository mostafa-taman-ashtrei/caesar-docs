import { privateProcedure, publicProcedure, router } from "./trpc";

import { DB } from "@/lib/prisma";
import { TRPCError } from "@trpc/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { z } from "zod";

export const appRouter = router({
    authCallback: publicProcedure.query(async () => {
        const { getUser } = getKindeServerSession();
        const user = await getUser();

        if (user === null || !user.id || !user.email) throw new TRPCError({ code: "UNAUTHORIZED" });

        const dbUser = await DB.user.findFirst({ where: { id: user.id } });

        if (!dbUser) {
            await DB.user.create({
                data: {
                    id: user.id,
                    email: user.email,
                },
            });
        }

        return { success: true };
    }),

    getFile: privateProcedure.input(z.object({ key: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const { userId } = ctx;

            const file = await DB.file.findFirst({
                where: { key: input.key, userId }
            });

            if (!file) throw new TRPCError({ code: "NOT_FOUND" });
            return file;
        })
    ,

    getUserFiles: privateProcedure.query(async ({ ctx }) => {
        const { userId } = ctx;

        const files = await DB.file.findMany({
            where: { userId }
        });

        return files;
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;