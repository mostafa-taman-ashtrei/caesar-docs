"use client";

import { Menu, XIcon } from "lucide-react";

import Link from "next/link";
import NavLink from "./NavLink";
import { Separator } from "../ui/separator";
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
            {!isAuth ? (
              <>
                <NavLink
                  title="Dashboard"
                  href="/dashboard"
                  className="flex w-full items-center font-semibold"
                />

                <Separator />

                <NavLink
                  title="Sign Out"
                  className="flex w-full items-center font-semibold"
                  href="/sign-out"
                />
              </>
            ) : (
              <>
                <Link
                  className="flex w-full items-center font-semibold"
                  href="/pricing"
                >
                  Pricing
                </Link>

                <Separator />

                <Link
                  className="flex w-full items-center font-semibold"
                  href="/sign-in"
                >
                  Sign in
                </Link>
              </>
            )}

            <Separator />

            <div className="flex flex-row items-center justify-start gap-2 font-semibold">
              Theme: <ThemeTogglerButton />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNav;
