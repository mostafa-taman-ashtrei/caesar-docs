import { publicProcedure, router } from "./trpc";

import { DB } from "@/lib/prisma";
import { TRPCError } from "@trpc/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

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
    })
});

// export type definition of API
export type AppRouter = typeof appRouter;