"use client";

import { usePathname } from "next/navigation";
import Navbar from "@frontend/components/common/traveller/layout/Navbar";

export default function ConditionalNavbar() {
    const pathname = usePathname();

    // Hide navbar on authentication pages
    const hideNavbar = pathname === "/sign-up" || pathname === "/sign-in" || pathname.startsWith("/sign-in/");

    if (hideNavbar) {
        return null;
    }

    return <Navbar />;
}
