import GradientText from "../general/GradientText";
import Link from "next/link";
import MobileNav from "./MobileNav";
import NavLink from "./NavLink";
import React from "react";
import ThemeTogglerButton from "./ThemeToggle";
import UserNav from "./UserNav";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const Navbar: React.FC = async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    return (
        <nav className="sticky inset-x-0 top-0 z-30 h-14 w-full  bg-gray-100 backdrop-blur-lg transition-all dark:bg-zinc-900">
            <div className="px-7">
                <div className="flex h-14 items-center justify-between">
                    <Link href={user ? "/dashboard" : "/"} className="z-40 flex font-bold">
                        <GradientText text="Caesar Docs" />
                    </Link>

                    <MobileNav isAuth={!!user} />

                    <div className="hidden items-center sm:flex">
                        {!user
                            ? <NavLink title="Pricing" href="/pricing" />
                            : <UserNav
                                name={!user.given_name || !user.family_name ? "Your Account" : `${user.given_name} ${user.family_name}`}
                                email={user.email ?? ""}
                                imageUrl={user.picture ?? ""}
                            />
                        }
                        <ThemeTogglerButton />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
