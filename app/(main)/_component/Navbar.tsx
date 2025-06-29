'use client'
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { SearchIcon, X, ArrowRight, AlignLeft } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export function Navbar() {
    const { data: session } = authClient.useSession();

    const logOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    toast.success("Logged out successfully");
                },
            },
        });
    };

    const links = [
        { href: "/courses", label: "Courses" },
        { href: "/instructors", label: "Instructors" },
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
    ];

    // --- Components ---

    function NavbarLinks() {
        return (
            <ul className="hidden lg:flex gap-6">
                {links.map((link) => (
                    <li key={link.href}>
                        <Link href={link.href} className="text-lg text-foreground hover:text-primary transition-colors">
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        );
    }

    function NavbarSearch() {
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
            <div className="relative">
                {/* Mobile Search Icon */}
                <SearchIcon
                    className="w-5 h-5 text-muted-foreground md:hidden cursor-pointer"
                    onClick={handleSearchIconClick}
                />
                {/* Desktop Search Input */}
                <div className="hidden md:flex items-center">
                    <div className="relative w-full">
                        <Input
                            className="pr-10"
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
        );
    }

    function NavbarAuth() {
        return !session ? (
            <Link href="/sign-in">
                <Button className={buttonVariants({ className: "hidden lg:block" })}>
                    Sign In
                </Button>
            </Link>
        ) : (
            <Button
                variant="destructive"
                onClick={logOut}
                className={buttonVariants({ className: "hidden lg:block" })}
            >
                Log Out
            </Button>
        );
    }

    function MobileNavMenu() {
        const [isOpen, setIsOpen] = useState(false);
        const toggleMenu = () => setIsOpen(!isOpen);

        return (
            <div className="lg:hidden relative z-50">
                <button
                    aria-label="Open menu"
                    onClick={toggleMenu}
                    className="p-2 mr-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <AlignLeft className="h-6 w-6" />
                </button>
                {/* Overlay */}
                {isOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-40 z-40"
                        onClick={toggleMenu}
                    />
                )}
                {/* Drawer */}
                <nav
                    className={`fixed top-0 left-0 h-full w-64 bg-card shadow-lg z-50 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
                        }`}
                >
                    <div className="flex items-center justify-between p-4 border-b">
                        <span className="text-xl font-bold">Menu</span>
                        <button
                            aria-label="Close menu"
                            onClick={toggleMenu}
                            className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    <ul className="flex flex-col p-4 space-y-4">
                        {links.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className="text-lg block px-2 py-1 rounded hover:bg-accent hover:text-accent-foreground transition"
                                    onClick={toggleMenu}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="absolute bottom-0 left-0 w-full">
                        {!session ? <Link
                            href="/sign-in"
                            className="block w-full bg-primary text-white text-center py-3 border-none rounded-none hover:bg-accent hover:text-accent-foreground transition"
                        >
                            Sign-in
                        </Link> : <Button
                            variant='destructive'
                            onClick={() => {
                                logOut();
                                toggleMenu();
                            }}
                            className="block w-full bg-primary text-white text-center py-3 border-none rounded-none hover:bg-accent hover:text-accent-foreground transition"
                        >
                            Log Out
                        </Button>
                        }
                    </div>
                </nav >
            </div >
        );
    }

    // --- Main Navbar ---
    return (
        <nav className="sticky top-0 w-full border-b bg-background z-50">
            <div className="w-full lg:w-[90%] mx-auto flex items-center justify-between py-4 px-2">
                <div className="flex items-center gap-8">
                    <MobileNavMenu />
                    <Link href="/" className="text-2xl font-bold space-x-2 text-primary">
                        Gurukul
                    </Link>
                    <NavbarLinks />
                </div>
                <div className="flex items-center gap-4">
                    <NavbarSearch />
                    <NavbarAuth />
                    <ThemeToggle />
                </div>
            </div>
        </nav>
    );
}