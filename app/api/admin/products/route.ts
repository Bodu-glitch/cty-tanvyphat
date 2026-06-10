import { NextRequest, NextResponse } from 'next/server'
import { createSSRClient } from '@/src/lib/supabase/server'
import { getAdminClient } from '@/src/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const supabase = await createSSRClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { slug, name, category, description, images, price, stock, featured, fb_post_url, keyword } = body

  if (!slug || !name || !category) {
    return NextResponse.json({ error: 'Thiếu thông tin bắt buộc (tên, slug, danh mục)' }, { status: 400 })
  }

  const db = getAdminClient()

  const { data: existing } = await db
    .from('products')
    .select('id')
    .eq('slug', slug)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: 'Slug đã tồn tại, hãy chỉnh sửa tên hoặc slug' }, { status: 409 })
  }

  const { data, error } = await db
    .from('products')
    .insert({
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
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
