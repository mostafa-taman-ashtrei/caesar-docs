import { Avatar, AvatarFallback } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { LayoutDashboard, UserRound, Wallet, Zap } from "lucide-react";

import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/server";
import { getUserSubscriptionPlan } from "@/lib/stripe";

interface UserNavProps {
    email: string | undefined
    name: string
    imageUrl: string
}

const UserNav = async ({ email, imageUrl, name }: UserNavProps) => {
    const subscriptionPlan = await getUserSubscriptionPlan();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                asChild
                className="overflow-visible"
            >
                <Button className="rounded-full h-10 w-10 aspect-square" variant="ghost" size="icon">
                    <Avatar className="relative w-10 h-10">
                        {
                            imageUrl
                                ? <div className="relative aspect-square h-full w-full">
                                    <Image
                                        fill
                                        src={imageUrl}
                                        alt="profile picture"
                                        referrerPolicy="no-referrer"
                                    />
                                </div>
                                : <AvatarFallback>
                                    <span className="sr-only">{name}</span>
                                    <UserRound className="h-4 w-4" />
                                </AvatarFallback>
                        }
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-0.5 leading-none">
                        {
                            name && <p className="font-medium text-sm">
                                {name}
                            </p>
                        }
                        {
                            email &&
                            <p className="w-[200px] truncate text-xs text-zinc-700">
                                {email}
                            </p>
                        }
                    </div>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                        <LayoutDashboard className="text-blue-600 h-4 w-4 mr-1.5" />
                        Dashboard
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    {subscriptionPlan?.isSubscribed
                        ? <Link href="/dashboard/billing" className="cursor-pointer">
                            <Wallet className="text-blue-600 h-4 w-4 mr-1.5" />
                            Manage Subscription
                        </Link>
                        : <Link href="/pricing" className="cursor-pointer">
                            <Zap className="text-blue-600 h-4 w-4 mr-1.5" />
                            Upgrade To Pro
                        </Link>
                    }
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem className="cursor-pointer">
                    <LogoutLink>
                        Log out
                    </LogoutLink>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserNav;