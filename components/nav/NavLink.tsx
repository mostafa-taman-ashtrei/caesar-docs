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
    <Link
      href={href}
      className={cn("font-semibold hover:underline", className)}
    >
      {title}
    </Link>
  );
};

export default NavLink;
