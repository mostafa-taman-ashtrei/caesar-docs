import { NextRequest } from "next/server";
import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";

interface ParamsType {
    params: { kindeAuth: "register" };
}

export const GET = (request: NextRequest, { params }: ParamsType) => {
    const endpoint = params.kindeAuth;
    return handleAuth(request, endpoint);
};
