import { NextRequest } from 'next/server'
import { getAdminClient } from '@/src/lib/supabase/admin'

export async function GET(request: NextRequest) {
  const phone = request.nextUrl.searchParams.get('phone')?.trim()

  if (!phone || phone.length < 9) {
    return Response.json({ error: 'Số điện thoại không hợp lệ' }, { status: 400 })
  }

  const db = getAdminClient()

  const { data: orders, error } = await db
    .from('orders')
    .select(`
      id,
      customer_name,
      customer_phone,
      customer_address,
      province,
      district,
      note,
      total_price,
      shipping_fee,
      payment_method,
      payment_status,
      status,
      created_at,
      order_items (
        id,
        product_name,
        product_price,
        unit_name,
        quantity
      )
    `)
    .eq('customer_phone', phone)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    console.error('Lookup error:', error)
    return Response.json({ error: 'Không thể tra cứu' }, { status: 500 })
  }

  return Response.json({ orders: orders ?? [] })
}
