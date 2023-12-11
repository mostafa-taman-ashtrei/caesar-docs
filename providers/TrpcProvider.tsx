"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

import { absoluteUrl } from "@/lib/utils";
import { httpBatchLink } from "@trpc/client";
import { trpc } from "@/app/_trpc/client";

interface TrpcProviderProps {
    children: ReactNode;
}

const TrpcProvider: React.FC<TrpcProviderProps> = ({ children }) => {
    const [queryClient] = useState(() => new QueryClient());

    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [httpBatchLink({ url: absoluteUrl("/api/trpc") })],
        })
    );

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </trpc.Provider>
    );
};

export default TrpcProvider;
