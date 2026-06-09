import { NextRequest } from 'next/server'
import { getAdminClient } from '@/src/lib/supabase/admin'

interface SePayBody {
  content?: string
  code?: string
  transferType?: string
  transferAmount?: number
  [key: string]: unknown
}

export async function POST(request: NextRequest) {
  // Xác thực token từ SePay
  const authHeader = request.headers.get('Authorization') ?? ''
  const token = authHeader.replace('Apikey ', '').trim()
  const expectedToken = process.env.SEPAY_WEBHOOK_SECRET ?? ''

  if (!expectedToken || token !== expectedToken) {
    return Response.json({ success: false }, { status: 401 })
  }

  let body: SePayBody
  try {
    body = await request.json()
  } catch {
    return Response.json({ success: false }, { status: 400 })
  }

  // Chỉ xử lý giao dịch nhận tiền
  if (body.transferType !== 'in') {
    return Response.json({ success: true })
  }

  const content = ((body.content ?? body.code ?? '') as string).toUpperCase()

  // Tìm mã TVP: TVP + 8 ký tự hex (không có dấu gạch)
  const match = content.match(/TVP([A-F0-9]{8})/)
  if (!match) {
    console.log('[sepay] Không tìm thấy mã TVP trong nội dung:', content)
    return Response.json({ success: true })
  }

  const prefix = match[1].toLowerCase() // 8 ký tự hex đầu của token

  const db = getAdminClient()

  // Tìm pending_payment theo token prefix
  const { data: pendings } = await db
    .from('pending_payments')
    .select('token, amount, customer_name, customer_phone, customer_address, province, district, note, fb_user_id, items, shipping_fee')
    .eq('status', 'waiting')

  const pending = pendings?.find(p => {
    const t = (p.token as string).replace(/-/g, '')
    return t.startsWith(prefix)
  })

  if (!pending) {
    console.log('[sepay] Không tìm thấy pending_payment cho prefix:', prefix)
    return Response.json({ success: true })
  }

  // Kiểm tra hết hạn
  const { data: full } = await db
    .from('pending_payments')
    .select('expires_at')
    .eq('token', pending.token)
    .single()

  if (full && new Date(full.expires_at) < new Date()) {
    await db.from('pending_payments').update({ status: 'expired' }).eq('token', pending.token)
    console.log('[sepay] Pending payment đã hết hạn:', pending.token)
    return Response.json({ success: true })
  }

  // Parse items
  const items = typeof pending.items === 'string'
    ? JSON.parse(pending.items)
    : pending.items as { product_id: number; quantity: number }[]

  // Lấy thông tin sản phẩm để tạo order_items
  const productIds = items.map((i: { product_id: number }) => i.product_id)
  const { data: products } = await db
    .from('products')
    .select('id, name, price')
    .in('id', productIds)

  const productMap = Object.fromEntries((products ?? []).map(p => [p.id, p]))
  const resolvedItems = items.map((item: { product_id: number; quantity: number }) => ({
    product_id: item.product_id,
    product_name: productMap[item.product_id]?.name ?? 'Sản phẩm không xác định',
    product_price: productMap[item.product_id]?.price ?? 0,
    quantity: item.quantity,
  }))

  const subtotal = resolvedItems.reduce(
    (sum: number, i: { product_price: number; quantity: number }) =>
      sum + Number(i.product_price) * i.quantity,
    0
  )
  const totalPrice = subtotal + Number(pending.shipping_fee ?? 0)

  // Tạo đơn hàng thật
  const { data: order, error: orderError } = await db
    .from('orders')
    .insert({
      customer_name: pending.customer_name,
      customer_phone: pending.customer_phone,
      customer_address: pending.customer_address,
      note: pending.note ?? null,
      total_price: totalPrice,
      shipping_fee: pending.shipping_fee ?? 0,
      province: pending.province ?? null,
      district: pending.district ?? null,
      status: 'moi',
      payment_method: 'bank_transfer',
      payment_status: 'paid',
    })
    .select('id')
    .single()

  if (orderError || !order) {
    console.error('[sepay] Tạo order thất bại:', orderError)
    return Response.json({ success: false }, { status: 500 })
  }

  // Tạo order_items
  await db.from('order_items').insert(
    resolvedItems.map((i: { product_id: number; product_name: string; product_price: number; quantity: number }) => ({
      order_id: order.id,
      ...i,
    }))
  )

  // Upsert fb_customers nếu có
  if (pending.fb_user_id) {
    await db.from('fb_customers').upsert({
      fb_user_id: pending.fb_user_id,
      customer_name: pending.customer_name,
      customer_phone: pending.customer_phone,
      customer_address: pending.customer_address,
      updated_at: new Date().toISOString(),
    })
  }

  // Cập nhật pending_payment thành paid
  await db
    .from('pending_payments')
    .update({ status: 'paid', order_id: order.id })
    .eq('token', pending.token)

  console.log('[sepay] Đã xác nhận thanh toán, tạo đơn:', order.id)
  return Response.json({ success: true })
}
