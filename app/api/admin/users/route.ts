import { NextRequest } from 'next/server'
import { createSSRClient } from '@/src/lib/supabase/server'
import { getAdminClient } from '@/src/lib/supabase/admin'

async function requireAdmin() {
  const supabase = await createSSRClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.app_metadata?.role !== 'admin') return null
  return user
}

// GET /api/admin/users — danh sách tất cả user
export async function GET() {
  if (!await requireAdmin()) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = getAdminClient()
  const { data, error } = await db.auth.admin.listUsers({ perPage: 200 })
  if (error) return Response.json({ error: error.message }, { status: 500 })

  const users = data.users.map(u => ({
    id: u.id,
    email: u.email,
    full_name: u.user_metadata?.full_name ?? u.user_metadata?.name ?? null,
    avatar_url: u.user_metadata?.avatar_url ?? null,
    provider: u.app_metadata?.provider ?? 'email',
    role: u.app_metadata?.role ?? null,
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at,
  }))

  return Response.json({ users })
}

// PATCH /api/admin/users — cập nhật role của user
export async function PATCH(request: NextRequest) {
  const caller = await requireAdmin()
  if (!caller) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { user_id, role } = await request.json() as { user_id: string; role: 'admin' | null }

  if (!user_id) return Response.json({ error: 'Thiếu user_id' }, { status: 400 })

  // Không cho tự xoá quyền admin của chính mình
  if (caller.id === user_id && role !== 'admin') {
    return Response.json({ error: 'Không thể tự xoá quyền admin của chính mình' }, { status: 400 })
  }

  const db = getAdminClient()
  const newMeta = role === 'admin' ? { role: 'admin' } : { role: null }
  const { error } = await db.auth.admin.updateUserById(user_id, { app_metadata: newMeta })
  if (error) return Response.json({ error: error.message }, { status: 500 })

  return Response.json({ success: true })
}
