import {createSSRClient} from '@/src/lib/supabase/server'
import {redirect} from 'next/navigation'
import Link from 'next/link'
import {ArrowLeft, Package, MapPin, User, Phone, Clock, CheckCircle2, XCircle, AlertCircle} from 'lucide-react';

type OrderItem = {
    product_name: string;
    unit_name: string | null;
    product_price: number;
    quantity: number;
};

export default async function DonHangChiTietPage({
                                                     params,
                                                 }: {
    params: Promise<{ id: string }>
}) {
    const {id: orderId} = await params;

    if (!orderId) redirect('/don-hang-da-dat');

    const supabase = await createSSRClient();
    const {data: {user}} = await supabase.auth.getUser();

    if (!user) {
        redirect('/dang-nhap?redirect=/don-hang-da-dat');
    }

    const {data: order, error} = await supabase
        .from('orders')
        .select(`
            *,
            order_items (
                product_name,
                unit_name,
                product_price,
                quantity
            )
        `)
        .eq('id', orderId)
        .eq('user_id', user.id)
        .single();

    if (error || !order) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 px-4">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4"/>
                    <h2 className="text-2xl font-semibold mb-2">Không tìm thấy đơn hàng</h2>
                    <p className="text-slate-600 mb-6">Đơn hàng #{orderId} không tồn tại hoặc không thuộc về bạn.</p>
                    <Link href="/don-hang-da-dat" className="text-blue-600 hover:underline">
                        ← Quay lại danh sách đơn hàng
                    </Link>
                </div>
            </div>
        );
    }

    // Status config
    const statusConfig: Record<string, { label: string; badgeColor: string; icon: unknown }> = {
        moi: {label: 'Mới', badgeColor: 'bg-blue-100 text-blue-700', icon: Clock},
        dang_xu_ly: {label: 'Đang xử lý', badgeColor: 'bg-amber-100 text-amber-700', icon: Clock},
        da_giao: {label: 'Đã giao', badgeColor: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2},
        da_huy: {label: 'Đã hủy', badgeColor: 'bg-red-100 text-red-700', icon: XCircle},
    };

    const currentStatus = statusConfig[order.status] || {
        label: order.status,
        badgeColor: 'bg-slate-100 text-slate-700',
        icon: Package
    };

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="max-w-3xl mx-auto px-4">
                {/* Back Button */}
                <Link href="/don-hang-da-dat"
                      className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6 font-medium">
                    <ArrowLeft className="w-4 h-4"/>
                    Quay lại danh sách đơn hàng
                </Link>

                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <p className="text-sm text-slate-500">Mã đơn hàng</p>
                            <p className="text-xl font-bold text-slate-900 font-mono tracking-wider">
                                #{order.id.toUpperCase()}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-slate-500">Ngày đặt hàng</p>
                            <p className="font-medium text-slate-900">
                                {new Date(order.created_at).toLocaleString('vi-VN', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Thông tin giao hàng */}
                    <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border p-6">
                        <div className="flex items-center gap-3 mb-5">
                            <MapPin className="w-5 h-5 text-slate-700"/>
                            <h2 className="font-semibold text-lg">Thông tin giao hàng</h2>
                        </div>

                        <div className="space-y-4 text-sm">
                            <div>
                                <p className="text-slate-500 mb-1">Họ tên:</p>
                                <p className="font-medium">{order.customer_name}</p>
                            </div>
                            <div>
                                <p className="text-slate-500 mb-1">Điện thoại:</p>
                                <p className="font-medium">{order.customer_phone}</p>
                            </div>
                            <div>
                                <p className="text-slate-500 mb-1">Địa chỉ:</p>
                                <p className="leading-relaxed">
                                    {order.customer_address}
                                    {(order.district || order.province) && (
                                        <span className="block mt-1">
                                            {order.district}, {order.province}
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Trạng thái đơn hàng */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border p-6">
                        <div className="flex items-center gap-3 mb-5">
                            <Clock className="w-5 h-5 text-slate-700"/>
                            <h2 className="font-semibold text-lg">Trạng thái đơn hàng</h2>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <p className="text-slate-500 text-sm mb-1">Trạng thái đơn hàng</p>
                                <span
                                    className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium ${currentStatus.badgeColor}`}>
                                    {currentStatus.label}
                                </span>
                            </div>

                            <div>
                                <p className="text-slate-500 text-sm mb-1">Trạng thái thanh toán</p>
                                <span
                                    className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700">
                                    Chờ thanh toán
                                </span>
                            </div>

                            <div>
                                <p className="text-slate-500 text-sm mb-1">Hình thức</p>
                                <p className="font-medium">Thanh toán khi nhận hàng (COD)</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sản phẩm đã đặt */}
                <div className="mt-8 bg-white rounded-2xl shadow-sm border p-6">
                    <h2 className="font-semibold text-lg mb-6">Sản phẩm đã đặt ({order.order_items?.length || 0})</h2>

                    <div className="divide-y">
                        {(order.order_items || []).map((item: OrderItem, idx: number) => (
                            <div key={idx} className="py-5 flex justify-between items-start">
                                <div>
                                    <p className="font-medium text-slate-900">
                                        {item.product_name}
                                        {item.unit_name &&
                                            <span className="text-slate-500 text-sm"> ({item.unit_name})</span>}
                                    </p>
                                    <p className="text-sm text-slate-500 mt-1">
                                        {item.product_price.toLocaleString('vi-VN')} ₫ × {item.quantity}
                                    </p>
                                </div>
                                <p className="font-semibold text-right">
                                    {(item.product_price * item.quantity).toLocaleString('vi-VN')} ₫
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Thanh toán summary */}
                    <div className="border-t pt-6 mt-6 space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Tạm tính</span>
                            <span>{(order.total_price - order.shipping_fee).toLocaleString('vi-VN')} ₫</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Phí giao hàng</span>
                            <span>{order.shipping_fee.toLocaleString('vi-VN')} ₫</span>
                        </div>
                        <div className="flex justify-between pt-4 border-t text-base font-semibold">
                            <span>Tổng cộng</span>
                            <span className="text-blue-600">
                                {order.total_price.toLocaleString('vi-VN')} ₫
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}