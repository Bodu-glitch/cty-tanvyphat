import { NextRequest, NextResponse } from 'next/server'
import { createSSRClient } from '@/src/lib/supabase/server'
import { getAdminClient } from '@/src/lib/supabase/admin'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createSSRClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const { slug, name, category, description, images, price, stock, featured, fb_post_url, keyword, unit } = body

  if (!slug || !name || !category) {
    return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 })
  }

  const db = getAdminClient()

  const { data: existing } = await db
    .from('products')
    .select('id')
    .eq('slug', slug)
    .neq('id', Number(id))
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: 'Slug đã tồn tại, hãy chỉnh sửa tên hoặc slug' }, { status: 409 })
  }

  const { data, error } = await db
    .from('products')
    .update({
      slug,
      name,
      category,
      description: description || '',
      images: images || [],
      price: price !== null && price !== '' ? Number(price) : null,
      stock: Number(stock) || 0,
      featured: Boolean(featured),
      fb_post_url: fb_post_url || null,
      keyword: keyword || null,
      unit: unit || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', Number(id))
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createSSRClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { error } = await getAdminClient()
    .from('products')
    .delete()
    .eq('id', Number(id))

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
