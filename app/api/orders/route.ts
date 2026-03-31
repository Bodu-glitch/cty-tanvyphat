import { NextRequest } from 'next/server'
import { getAdminClient } from '@/src/lib/supabase/admin'

export async function POST(request: NextRequest) {
  let body: Record<string, string>
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { token, customer_name, customer_phone, customer_address, note } = body

  if (!token || !customer_name || !customer_phone || !customer_address) {
    return Response.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 })
  }

  const db = getAdminClient()

  // Fetch cart session
  const { data: session } = await db
    .from('cart_sessions')
    .select('id, fb_user_id, product_id, quantity, status, expires_at')
    .eq('token', token)
    .single()

  if (!session) {
    return Response.json({ error: 'Không tìm thấy giỏ hàng' }, { status: 404 })
  }

  if (session.status !== 'pending') {
    return Response.json({ error: 'Giỏ hàng đã được xử lý' }, { status: 410 })
  }

  if (new Date(session.expires_at) < new Date()) {
    return Response.json({ error: 'Liên kết đặt hàng đã hết hạn' }, { status: 410 })
  }

  // Fetch product for current price/name
  const { data: product } = await db
    .from('products')
    .select('name, price')
    .eq('id', session.product_id)
    .single()

  if (!product) {
    return Response.json({ error: 'Không tìm thấy sản phẩm' }, { status: 404 })
  }

  // Create order
  const { data: order, error: orderError } = await db
    .from('orders')
    .insert({
      cart_session_id: session.id,
      product_id: session.product_id,
      product_name: product.name,
      product_price: product.price ?? 0,
      quantity: session.quantity,
      customer_name,
      customer_phone,
      customer_address,
      note: note ?? null,
    })
    .select('id')
    .single()

  if (orderError || !order) {
    console.error('Create order error:', orderError)
    return Response.json({ error: 'Không thể tạo đơn hàng' }, { status: 500 })
  }

  // Mark cart session as ordered
  await db
    .from('cart_sessions')
    .update({ status: 'ordered' })
    .eq('id', session.id)

  // Upsert fb_customers with latest info
  await db.from('fb_customers').upsert({
    fb_user_id: session.fb_user_id,
    customer_name,
    customer_phone,
    customer_address,
    updated_at: new Date().toISOString(),
  })

  return Response.json({ success: true, order_id: order.id })
}
