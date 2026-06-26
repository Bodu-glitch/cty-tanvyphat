import { createSSRClient } from '@/src/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

type Order = {
    id: number
    created_at: string
    total_price: number
    status: string
    customer_name: string
    shipping_fee: number
}

export default async function DonHangDaDatPage() {
    const supabase = await createSSRClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    // Nếu chưa đăng nhập → chuyển về trang đăng nhập
    if (authError || !user) {
        redirect('/dang-nhap?redirect=/don-hang-da-dat')
    }

    // Lấy danh sách đơn hàng của user
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

    const statusMap: Record<string, { label: string; color: string }> = {
        moi: { label: 'Mới', color: 'bg-blue-100 text-blue-700' },
        dang_xu_ly: { label: 'Đang xử lý', color: 'bg-yellow-100 text-yellow-700' },
        da_giao: { label: 'Đã giao', color: 'bg-green-100 text-green-700' },
        da_huy: { label: 'Đã hủy', color: 'bg-red-100 text-red-700' },
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Đơn hàng đã đặt</h1>

            {!orders || orders.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-xl text-gray-500 mb-4">Bạn chưa có đơn hàng nào</p>
                    <Link
                        href="/"
                        className="inline-block bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition"
                    >
                        Tiếp tục mua sắm
                    </Link>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="p-4 text-left">Mã đơn</th>
                            <th className="p-4 text-left">Ngày đặt</th>
                            <th className="p-4 text-left">Tổng tiền</th>
                            <th className="p-4 text-left">Trạng thái</th>
                            <th className="p-4 text-center">Chi tiết</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orders.map((order: Order) => {
                            const status = statusMap[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-700' }
                            return (
                                <tr key={order.id} className="border-b hover:bg-gray-50">
                                    <td className="p-4 font-medium">#{order.id}</td>
                                    <td className="p-4 text-gray-600">
                                        {new Date(order.created_at).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="p-4 font-semibold">
                                        {order.total_price.toLocaleString('vi-VN')} ₫
                                    </td>
                                    <td className="p-4">
                      <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${status.color}`}>
                        {status.label}
                      </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <Link
                                            href={`/don-hang-da-dat/${order.id}`}
                                            className="text-blue-600 hover:underline font-medium"
                                        >
                                            Xem chi tiết →
                                        </Link>
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}