import type { MetadataRoute } from 'next'
import { getProducts, getCategories } from '../src/lib/supabase/server'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tanvyphat.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([getProducts(), getCategories()])

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL,                     changeFrequency: 'weekly',  priority: 1.0, lastModified: new Date() },
    { url: `${SITE_URL}/san-pham`,       changeFrequency: 'daily',   priority: 0.9, lastModified: new Date() },
    { url: `${SITE_URL}/gioi-thieu`,     changeFrequency: 'monthly', priority: 0.6, lastModified: new Date() },
    { url: `${SITE_URL}/lien-he`,        changeFrequency: 'monthly', priority: 0.6, lastModified: new Date() },
    { url: `${SITE_URL}/tuyen-dung`,     changeFrequency: 'monthly', priority: 0.5, lastModified: new Date() },
    { url: `${SITE_URL}/tin-tuc`,        changeFrequency: 'weekly',  priority: 0.7, lastModified: new Date() },
  ]

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${SITE_URL}/san-pham?category=${cat.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
    lastModified: new Date(cat.updated_at),
  }))

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/san-pham/${p.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
    lastModified: new Date(p.updated_at),
  }))

  return [...staticPages, ...categoryPages, ...productPages]
}
