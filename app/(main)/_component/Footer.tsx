import Link from "next/link";

export default function Footer() {
        const links = [
        { href: "/", label: "Home" },
        { href: "/about", label: "About" },
        { href: "/course", label: "Courses" },
        { href: "/contact", label: "Contact" },
        { href: "/privacy", label: "Privacy Policy" },
    ];
  return (
    <footer className="w-full border-t bg-background py-8 mt-16">
      <div className="w-[80%] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <span className="text-xl font-bold text-primary">Gurukul</span>
          <p className="text-muted-foreground text-sm mt-1">
            Empowering learners & educators. © {new Date().getFullYear()} Gurukul. All rights reserved.
          </p>
        </div>
        <nav className="flex flex-col md:flex-row gap-4 md:gap-8 items-center">
            {links.map((link) => (
          <Link key={link.href} href={link.href} className="text-muted-foreground hover:text-primary transition-colors text-sm">
            {link.label}
          </Link>
            ))}
          
        </nav>
        <div className="flex gap-4 items-center">
          <a href="https://github.com/jain-arihant-2002/gurukul-v3" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-muted-foreground hover:text-primary transition-colors">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.747-1.025 2.747-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.339 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.744 0 .267.18.579.688.481C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"/></svg>
          </a>
        </div>
      </div>
    </footer>
  );
}