import Footer from "./_component/Footer";
import { Navbar } from "./_component/Navbar";

export default function Layout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return <>
        <Navbar />
        {children}
        <Footer />
    </>
} 