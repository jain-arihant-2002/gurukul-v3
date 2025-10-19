import { AnimatePresence } from "framer-motion";
import Footer from "./_component/Footer";
import { Navbar } from "./_component/Navbar";
import PageTransition from "@/components/animation/AnimatePresence";

export default function Layout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <>
            <Navbar />
            <main className="min-h-[80vh]">
                <PageTransition>
                    {children}
                </PageTransition>

            </main>
            <Footer />
        </>
    );
}