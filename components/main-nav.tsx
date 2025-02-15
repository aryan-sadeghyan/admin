"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function MainNav({
  className,
}: React.HtmlHTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();

  // Prevent hydration mismatch
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Or a skeleton loader
  }

  const routes = [
    { href: `/${params.storeId}`, label: "Overview" },
    { href: `/${params.storeId}/billboards`, label: "Billboards" },
    { href: `/${params.storeId}/categories`, label: "Categories" },
    { href: `/${params.storeId}/sizes`, label: "Sizes" },
    { href: `/${params.storeId}/colors`, label: "Colors" },
    { href: `/${params.storeId}/products`, label: "Products" },
    { href: `/${params.storeId}/orders`, label: "Orders" },
    { href: `/${params.storeId}/settings`, label: "Settings" },
  ].map((route) => ({
    ...route,
    active: pathname === route.href,
  }));

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition hover:text-primary",
            route.active
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
}
