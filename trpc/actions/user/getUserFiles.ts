import { DB } from "@/lib/prisma";
import { privateProcedure } from "@/trpc/trpc";

const getUserFiles = privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    const files = await DB.file.findMany({
        where: { userId },
    });

    return files;
});

export default getUserFiles;