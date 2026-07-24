import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { BackToTop } from "@/components/BackToTop";
import { cn } from "@/lib/utils";

type MainLayoutProps = {
    children: ReactNode;
    variant?: "home" | "detail";
    className?: string;
    showFooter?: boolean;
    showBackToTop?: boolean;
};

export const MainLayout = ({
    children,
    variant = "home",
    className = "",
    showFooter = true,
    showBackToTop = true,
}: MainLayoutProps) => {
    return (
        <div className={cn("min-h-screen", className)}>
            <Navbar variant={variant} />
            <main className="flex-grow">{children}</main>
            {showFooter ? <Footer showSectionNumber={variant === "home"} /> : null}
            {showBackToTop ? <BackToTop /> : null}
        </div>
    );
};
