import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export type ProductRow = {
  id: number
  slug: string
  name: string
  category: string
  description: string
  images: string[]
  fb_post_url: string | null
  featured: boolean
  keyword: string | null
  price: number | null
  stock: number
  created_at: string
  updated_at: string
}

export type CategoryRow = {
  id: number
  slug: string
  name: string
  description: string
  icon: string
  created_at: string
  updated_at: string
}

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Missing Supabase env vars')
  return createClient(url, key)
}

export async function createSSRClient() {
  const cookieStore = await cookies()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createServerClient(url, key, {
    cookies: {
      getAll() { return cookieStore.getAll() },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options))
      },
    },
  })
}

export async function getProducts(): Promise<ProductRow[]> {
  const { data, error } = await getClient()
    .from('products')
    .select('*')
    .order('featured', { ascending: false })
    .order('name')
  if (error) throw new Error(`getProducts: ${error.message}`)
  return data ?? []
}

export async function getProductBySlug(slug: string): Promise<ProductRow | null> {
  const { data, error } = await getClient()
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()
  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(`getProductBySlug: ${error.message}`)
  }
  return data
}

export async function getCategories(): Promise<CategoryRow[]> {
  const { data, error } = await getClient()
    .from('categories')
    .select('*')
    .order('name')
  if (error) throw new Error(`getCategories: ${error.message}`)
  return data ?? []
}

export async function getProductsByCategory(categorySlug: string): Promise<ProductRow[]> {
  const { data, error } = await getClient()
    .from('products')
    .select('*')
    .eq('category', categorySlug)
    .order('name')
  if (error) throw new Error(`getProductsByCategory: ${error.message}`)
  return data ?? []
}
