import HoverLink from "../general/HoverLink";
import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";

interface NavLinkProps {
    title: string;
    href: string;
    className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ title, href, className }) => {
    return (
        <HoverLink>
            <Link
                href={href}
                className={cn("font-semibold", className)}
            >
                {title}
            </Link>
        </HoverLink>

    );
};

export default NavLink;
