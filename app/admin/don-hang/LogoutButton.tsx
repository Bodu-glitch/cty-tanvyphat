'use client'

import { createSupabaseBrowserClient } from '@/src/lib/supabase/browser'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.push('/admin/dang-nhap')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
    >
      Đăng xuất
    </button>
  )
}
