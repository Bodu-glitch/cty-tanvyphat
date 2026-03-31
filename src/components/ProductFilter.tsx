'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useCallback, useTransition } from 'react'
import type { CategoryRow } from '../lib/supabase/server'

type ProductFilterProps = {
  categories: CategoryRow[]
  productCounts: Record<string, number>
  totalCount: number
  selectedCategory: string
  searchText: string
}

export default function ProductFilter({
  categories,
  productCounts,
  totalCount,
  selectedCategory,
  searchText,
}: ProductFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [, startTransition] = useTransition()

  const navigate = useCallback(
    (cat: string, search: string) => {
      const params = new URLSearchParams()
      if (cat !== 'all') params.set('category', cat)
      if (search.trim()) params.set('search', search.trim())
      const qs = params.toString()
      startTransition(() => {
        router.push(qs ? `${pathname}?${qs}` : pathname)
      })
    },
    [router, pathname]
  )

  return (
    <aside className="lg:w-56 shrink-0">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sticky top-20">
        <h2 className="font-bold text-[#1a3a6b] text-base mb-4">Danh mục</h2>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => navigate('all', searchText)}
            className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#1a56db] text-white'
                : 'text-gray-700 hover:bg-blue-50 hover:text-[#1a56db]'
            }`}
          >
            Tất cả sản phẩm
            <span className="ml-2 text-xs opacity-70">({totalCount})</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => navigate(cat.slug, searchText)}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                selectedCategory === cat.slug
                  ? 'bg-[#1a56db] text-white'
                  : 'text-gray-700 hover:bg-blue-50 hover:text-[#1a56db]'
              }`}
            >
              <span>{cat.icon}</span>
              <span className="flex-1">{cat.name}</span>
              <span className="text-xs opacity-70">({productCounts[cat.slug] ?? 0})</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
