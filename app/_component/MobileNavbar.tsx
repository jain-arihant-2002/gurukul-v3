'use client';
import { AlignLeft, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function MobileNavMenu({ links }: { links: { href: string, label: string }[] }) {
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
                    className="fixed inset-0  bg-opacity-40 z-40"
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
                {/* Login button at the bottom, no border radius */}
                <div className="absolute bottom-0 left-0 w-full">
                    <Link
                        href="/login"
                        className="block w-full bg-primary text-white text-center py-3 border-none rounded-none hover:bg-accent hover:text-accent-foreground transition"
                        // onClick={}
                    >
                        Login
                    </Link>
                </div>
            </nav>
        </div>
    );
}