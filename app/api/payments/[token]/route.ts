import { NextRequest } from 'next/server'
import { getAdminClient } from '@/src/lib/supabase/admin'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const db = getAdminClient()

  const { data: pending, error } = await db
    .from('pending_payments')
    .select('status, order_id, expires_at')
    .eq('token', token)
    .single()

  if (error || !pending) {
    return Response.json({ error: 'Không tìm thấy' }, { status: 404 })
  }

  // Tự chuyển sang expired nếu hết hạn và vẫn đang chờ
  if (pending.status === 'waiting' && new Date(pending.expires_at) < new Date()) {
    await db
      .from('pending_payments')
      .update({ status: 'expired' })
      .eq('token', token)
    return Response.json({ status: 'expired' })
  }

  return Response.json({
    status: pending.status,
    order_id: pending.order_id ?? undefined,
  })
}
