import { createSSRClient } from '@/src/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

type Order = {
    id: string
    created_at: string
    total_price: number
    status: string
    customer_name: string
    shipping_fee: number
    note?: string
}

export default async function DonHangDaDatPage() {
    const supabase = await createSSRClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        redirect('/dang-nhap?redirect=/don-hang-da-dat')
    }

    const { data: orders, error } = await supabase
        .from('orders')
        .select(`
            id,
            created_at,
            total_price,
            status,
            customer_name,
            shipping_fee,
            note
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Lỗi lấy đơn hàng:', error)
    }

    const statusMap: Record<string, { label: string; color: string; bg: string }> = {
        moi: { label: 'Mới', color: 'text-blue-700', bg: 'bg-blue-100' },
        dang_xu_ly: { label: 'Đang xử lý', color: 'text-yellow-700', bg: 'bg-yellow-100' },
        da_giao: { label: 'Đã giao', color: 'text-green-700', bg: 'bg-green-100' },
        da_huy: { label: 'Đã hủy', color: 'text-red-700', bg: 'bg-red-100' },
    }

    // Hàm format mã đơn hàng - hiển thị 8 ký tự đầu và chữ hoa
    const formatOrderCode = (id: string): string => {
        const clean = id.replace(/-/g, '')
        return `#${clean.slice(0, 8).toUpperCase()}`
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                        Đơn hàng đã đặt
                    </h1>
                    <Link
                        href="/san-pham"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition"
                    >
                        ← Tiếp tục mua sắm
                    </Link>
                </div>

                {!orders || orders.length === 0 ? (
                    <div className="bg-white rounded-3xl shadow-sm py-20 px-6 text-center">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                            📦
                        </div>
                        <p className="text-2xl font-semibold text-gray-700 mb-3">
                            Chưa có đơn hàng nào
                        </p>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                            Bạn chưa đặt đơn hàng nào. Hãy khám phá và mua sắm ngay!
                        </p>
                        <Link
                            href="/"
                            className="inline-block bg-black text-white px-10 py-4 rounded-2xl hover:bg-gray-800 transition text-lg font-medium"
                        >
                            Bắt đầu mua sắm
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden lg:block bg-white rounded-3xl shadow overflow-hidden">
                            <table className="w-full">
                                <thead>
                                <tr className="bg-gray-100 border-b">
                                    <th className="px-8 py-5 text-left font-semibold text-gray-700">Mã đơn</th>
                                    <th className="px-8 py-5 text-left font-semibold text-gray-700">Ngày đặt</th>
                                    <th className="px-8 py-5 text-left font-semibold text-gray-700">Khách hàng</th>
                                    <th className="px-8 py-5 text-left font-semibold text-gray-700">Tổng tiền</th>
                                    <th className="px-8 py-5 text-left font-semibold text-gray-700">Trạng thái</th>
                                    <th className="px-8 py-5 text-center font-semibold text-gray-700">Hành động</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y">
                                {orders.map((order: Order) => {
                                    const status = statusMap[order.status] || { label: order.status, color: 'text-gray-700', bg: 'bg-gray-100' }
                                    const displayCode = formatOrderCode(order.id)

                                    return (
                                        <tr key={order.id} className="hover:bg-gray-50 transition">
                                            <td className="px-8 py-6 font-mono font-semibold text-lg tracking-wider">
                                                {displayCode}
                                            </td>
                                            <td className="px-8 py-6 text-gray-600">
                                                {new Date(order.created_at).toLocaleDateString('vi-VN', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-8 py-6 text-gray-700 font-medium">{order.customer_name}</td>
                                            <td className="px-8 py-6 font-semibold text-lg">
                                                {order.total_price.toLocaleString('vi-VN')} ₫
                                            </td>
                                            <td className="px-8 py-6">
                                                    <span className={`inline-block px-5 py-2 rounded-full text-sm font-semibold ${status.bg} ${status.color}`}>
                                                        {status.label}
                                                    </span>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <Link
                                                    href={`/don-hang-da-dat/${order.id}`}
                                                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition"
                                                >
                                                    Xem chi tiết
                                                    <span className="text-xl">→</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="lg:hidden space-y-6">
                            {orders.map((order: Order) => {
                                const status = statusMap[order.status] || { label: order.status, color: 'text-gray-700', bg: 'bg-gray-100' }
                                const displayCode = formatOrderCode(order.id)

                                return (
                                    <div key={order.id} className="bg-white rounded-3xl shadow-sm p-6 hover:shadow-md transition">
                                        <div className="flex justify-between items-start mb-5">
                                            <div>
                                                <p className="text-sm text-gray-500">Mã đơn hàng</p>
                                                <p className="text-2xl font-bold font-mono tracking-wider text-gray-900">
                                                    {displayCode}
                                                </p>
                                            </div>
                                            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${status.bg} ${status.color}`}>
                                                {status.label}
                                            </span>
                                        </div>

                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Ngày đặt</span>
                                                <span className="font-medium">
                                                    {new Date(order.created_at).toLocaleDateString('vi-VN')}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Khách hàng</span>
                                                <span className="font-medium">{order.customer_name}</span>
                                            </div>
                                            <div className="flex justify-between pt-3 border-t">
                                                <span className="text-gray-500">Tổng tiền</span>
                                                <span className="text-2xl font-bold text-emerald-600">
                                                    {order.total_price.toLocaleString('vi-VN')} ₫
                                                </span>
                                            </div>
                                        </div>

                                        <Link
                                            href={`/don-hang-da-dat/${order.id}`}
                                            className="mt-6 block w-full bg-black text-white text-center py-4 rounded-2xl font-medium hover:bg-gray-800 transition"
                                        >
                                            Xem chi tiết đơn hàng
                                        </Link>
                                    </div>
                                )
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}