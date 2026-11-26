"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/medications", label: "Medicines" },
  { href: "/history", label: "History" },
  { href: "/settings", label: "Settings" },
];

export function AppNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className={`flex flex-wrap gap-2 ${className ?? ""}`}>
      {links.map((link) => {
        const active =
          pathname === link.href || pathname.startsWith(`${link.href}/`);

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={
              active
                ? "rounded-full bg-ink px-5 py-2 font-bold text-white"
                : "rounded-full border-2 border-ink px-5 py-2 font-bold hover:bg-ink hover:text-white"
            }
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}