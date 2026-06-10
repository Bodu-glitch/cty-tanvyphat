import { redirect } from 'next/navigation'
import { createSSRClient, getCategories } from '@/src/lib/supabase/server'
import ProductFormClient from '../ProductFormClient'

export default async function TaoMoiPage() {
  const supabase = await createSSRClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/dang-nhap')

  const categories = await getCategories()
  return <ProductFormClient categories={categories} />
}
