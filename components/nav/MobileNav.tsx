"use client";

import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs";
import { Menu, XIcon } from "lucide-react";

import HoverLink from "../general/HoverLink";
import NavLink from "./NavLink";
import ThemeTogglerButton from "./ThemeToggle";
import { useState } from "react";

interface MobileNavProps {
    isAuth: boolean;
}

const MobileNav: React.FC<MobileNavProps> = ({ isAuth }) => {
    const [isOpen, setOpen] = useState<boolean>(false);

    const toggleOpen = () => setOpen((prev) => !prev);

    return (
        <div className="sm:hidden">
            {isOpen ? (
                <XIcon
                    onClick={toggleOpen}
                    className="relative z-50 h-5 w-5 cursor-pointer text-zinc-500"
                />
            ) : (
                <Menu
                    onClick={toggleOpen}
                    className="relative z-50 h-5 w-5 cursor-pointer text-zinc-700"
                />
            )}

            {isOpen && (
                <div className="fixed inset-0 z-0 w-full animate-in fade-in-20 slide-in-from-top-5">
                    <div className="absolute grid w-full gap-3 bg-white px-10 pb-8 pt-20 shadow-xl dark:bg-black">
                        {isAuth ? (
                            <>
                                <NavLink
                                    title="Dashboard"
                                    href="/dashboard"
                                    className="flex w-full items-center font-semibold"
                                />


                                <HoverLink>
                                    <LogoutLink className="flex w-full items-center font-semibold">
                                        Sign out
                                    </LogoutLink>
                                </HoverLink>
                            </>
                        ) : (
                            <>
                                <NavLink
                                    title="Pricing"
                                    href="/pricing"
                                    className="flex w-full items-center font-semibold"
                                />

                                <HoverLink>
                                    <LoginLink className="flex w-full items-center font-semibold">
                                        Sign In
                                    </LoginLink>
                                </HoverLink>

                            </>
                        )}

                        <HoverLink>
                            <div className="flex flex-row items-center justify-start gap-2 font-semibold cursor-pointer">
                                Theme <ThemeTogglerButton />
                            </div>
                        </HoverLink>

                    </div>
                </div>
            )}
        </div>
    );
};

export default MobileNav;
