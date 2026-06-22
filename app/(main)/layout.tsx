import Navbar from '../../src/components/Navbar'
import Footer from '../../src/components/Footer'
import ContactCTA from '../../src/components/ContactCTA'

export default function MainLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <>
            <Navbar/>
            <main className="flex-1">{children}</main>
            <Footer/>
            <ContactCTA/>
        </>
    )
}