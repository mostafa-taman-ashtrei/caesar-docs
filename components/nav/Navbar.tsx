import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import MobileNav from "./MobileNav";
import NavLink from "./NavLink";
import React from "react";
import ThemeTogglerButton from "./ThemeToggle";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
  return (
    <nav className="sticky inset-x-0 top-0 z-30 h-14 w-full  bg-white backdrop-blur-lg transition-all dark:bg-black ">
      <div className="px-7">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="z-40 flex font-semibold">
            <span>OWL</span>
          </Link>

          <MobileNav isAuth={false} />

          <div className="hidden items-center space-x-4 sm:flex">
            <NavLink title="Pricing" href="/pricing" />

            <Button className="flex flex-row items-center justify-center rounded-full">
              Get started <ArrowRight className="ml-1.5 h-5 w-5" />
            </Button>
            <ThemeTogglerButton />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
