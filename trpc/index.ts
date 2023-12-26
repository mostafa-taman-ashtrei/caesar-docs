import {
    deleteFile,
    getFile,
    getFileMessages,
    getFileUploadStatus,
} from "./actions/files/fileData";

import authSync from "./actions/auth/authSync";
import createStripeSession from "./actions/stripe/createStripeSession";
import getUserFiles from "./actions/user/getUserFiles";
import { router } from "./trpc";

export const appRouter = router({
    authSync,
    getFile,
    getUserFiles,
    deleteFile,
    getFileUploadStatus,
    getFileMessages,
    createStripeSession,
});

// export type definition of API
export type AppRouter = typeof appRouter;
