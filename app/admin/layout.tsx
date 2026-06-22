import type {Metadata} from 'next'

export const metadata: Metadata = {
    title: 'Admin — CT Tân Vy Phát',
    robots: {index: false, follow: false},
}

export default function AdminLayout({
                                        children,
                                    }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="bg-gray-100 min-h-screen">
            {/* Layout dành riêng cho Admin, hoàn toàn độc lập và không dính Navbar/Footer của khách */}
            {children}
        </div>
    )
}