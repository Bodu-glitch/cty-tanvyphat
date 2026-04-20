'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useCallback, useTransition } from 'react'
import type { CategoryRow } from '../lib/supabase/server'

type Props = {
  categories: CategoryRow[]
  selectedBranch: string
  selectedCategory: string
  searchText: string
  sortBy: string
  sortDir: string
  perPage: number
}

export default function CategoryStrip({
  categories,
  selectedBranch,
  selectedCategory,
  searchText,
  sortBy,
  sortDir,
  perPage,
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [, startTransition] = useTransition()

  const go = useCallback(
    (categorySlug: string) => {
      const params = new URLSearchParams()
      if (selectedBranch !== 'all') params.set('branch', selectedBranch)
      if (searchText) params.set('search', searchText)
      if (sortBy !== 'name') params.set('sort', sortBy)
      if (sortDir !== 'asc') params.set('dir', sortDir)
      if (perPage !== 50) params.set('per_page', String(perPage))
      // toggle: clicking selected category deselects it
      if (categorySlug !== selectedCategory) params.set('category', categorySlug)
      const qs = params.toString()
      startTransition(() => router.push(qs ? `${pathname}?${qs}` : pathname))
    },
    [router, pathname, selectedBranch, selectedCategory, searchText, sortBy, sortDir, perPage]
  )

  const visibleCategories = selectedBranch === 'all'
    ? categories
    : categories.filter((cat) => cat.branch_slug === selectedBranch)

  return (
    <div className="bg-white rounded-2xl shadow-md -mt-8 relative z-10 w-fit mx-auto">
      <div className="flex items-center gap-1 px-4 py-4">
        {visibleCategories.map((cat) => {
          const isSelected = selectedCategory === cat.slug
          return (
            <button
              key={cat.slug}
              onClick={() => go(cat.slug)}
              className={`flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl min-w-[72px] transition-colors ${
                isSelected
                  ? 'bg-[#dce8ff] text-[#1a56db]'
                  : 'bg-[#f0f4ff] text-gray-700 hover:bg-[#dce8ff] hover:text-[#1a56db]'
              }`}
            >
              <span className="text-2xl leading-none">{cat.icon}</span>
              <span className="text-xs font-medium text-center leading-tight whitespace-nowrap">
                {cat.name}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
