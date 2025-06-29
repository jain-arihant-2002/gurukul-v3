'use client'
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { SearchIcon, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import MobileNavMenu from "./MobileNavbar";
import { useRef, useState } from "react";

export function Navbar() {
    const links = [
        { href: "/course", label: "Courses" },
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
    ];

    // State for mobile search
    const [showSearch, setShowSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const searchInputRef = useRef<HTMLInputElement>(null);

    const handleSearchIconClick = () => {
        setShowSearch(true);
        setTimeout(() => {
            searchInputRef.current?.focus();
        }, 100);
    };

    const handleSearch = () => {
        if (searchTerm.trim()) {
            // Redirect to search results page with the search term
            setShowSearch(false);
            setSearchTerm("");
        }
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <nav className="sticky top-0 w-full flex py-4 px-2 border-b-1 border-border items-center text-card-foreground z-50 justify-between ">
            <div className="flex items-center ">
                <MobileNavMenu links={links} />
                <Link href="/" className="text-2xl font-bold mr-8 space-x-2">
                    Gurukul
                </Link>
                <ul className="hidden space-x-4 lg:flex">
                    {links.map((link) => (
                        <li key={link.href}>
                            <Link href={link.href} className="text-lg">
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex items-center space-x-4">
                <div className="relative">
                    {/* Mobile Search Icon */}
                    <SearchIcon
                        className="w-5 h-5 text-muted-foreground md:hidden cursor-pointer"
                        onClick={handleSearchIconClick}
                    />
                    {/* Desktop Search Input */}
                    <div className="hidden md:flex items-center space-x-2">
                        <div className="relative w-full">
                            <Input
                                className="md:block pr-10 gap-2"
                                placeholder="Search Courses"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                onKeyDown={handleInputKeyDown}
                            />
                            <button
                                type="button"
                                onClick={handleSearch}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition"
                                tabIndex={-1}
                                aria-label="Search"
                            >
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    {/* Mobile Search Modal */}
                    {showSearch && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                            <div className="bg-white dark:bg-gray-900 p-4 rounded shadow w-11/12 max-w-sm flex items-center gap-2">
                                <div className="relative flex-1">
                                    <Input
                                        ref={searchInputRef}
                                        type="text"
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        onKeyDown={handleInputKeyDown}
                                        placeholder="Search courses..."
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleSearch}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition"
                                        aria-label="Search"
                                    >
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                                <button
                                    aria-label="Close search"
                                    onClick={() => setShowSearch(false)}
                                    className="ml-2 p-2"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <Link href="/login">
                    <Button className={buttonVariants({ className: "hidden lg:block" })}>
                        Login
                    </Button>
                </Link>
                <ThemeToggle />
            </div>
        </nav>
    );
}