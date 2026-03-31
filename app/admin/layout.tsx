import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin — CT Tân Vy Phát',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="bg-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  )
}
