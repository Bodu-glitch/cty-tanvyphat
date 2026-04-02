'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useCallback, useState, useTransition } from 'react'
import type { CategoryRow } from '../lib/supabase/server'

type ProductFilterProps = {
  categories: CategoryRow[]
  productCounts: Record<string, number>
  totalCount: number
  selectedCategory: string
  selectedBranch: string
  searchText: string
}

export default function ProductFilter({
  categories,
  productCounts,
  totalCount,
  selectedCategory,
  selectedBranch,
  searchText,
}: ProductFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [, startTransition] = useTransition()
  const [expandedBranches, setExpandedBranches] = useState<Set<string>>(
    () => new Set(['van-phong-pham', 'hang-thai-lan'])
  )

  const navigateAll = useCallback(() => {
    const params = new URLSearchParams()
    if (searchText.trim()) params.set('search', searchText.trim())
    const qs = params.toString()
    startTransition(() => { router.push(qs ? `${pathname}?${qs}` : pathname) })
  }, [router, pathname, searchText])

  const navigateBranch = useCallback(
    (branch: string) => {
      const params = new URLSearchParams()
      params.set('branch', branch)
      if (searchText.trim()) params.set('search', searchText.trim())
      startTransition(() => { router.push(`${pathname}?${params.toString()}`) })
    },
    [router, pathname, searchText]
  )

  const navigateCategory = useCallback(
    (slug: string) => {
      const params = new URLSearchParams()
      params.set('category', slug)
      if (searchText.trim()) params.set('search', searchText.trim())
      startTransition(() => { router.push(`${pathname}?${params.toString()}`) })
    },
    [router, pathname, searchText]
  )

  const toggleBranch = (branch: string) => {
    setExpandedBranches((prev) => {
      const next = new Set(prev)
      if (next.has(branch)) next.delete(branch)
      else next.add(branch)
      return next
    })
  }

  const isAllSelected = selectedCategory === 'all' && selectedBranch === 'all'

  const vpp = categories.filter((c) => c.branch === 'van-phong-pham')
  const thai = categories.filter((c) => c.branch === 'hang-thai-lan')

  const branchCount = (branch: 'van-phong-pham' | 'hang-thai-lan') =>
    categories
      .filter((c) => c.branch === branch)
      .reduce((sum, c) => sum + (productCounts[c.slug] ?? 0), 0)

  return (
    <aside className="lg:w-60 shrink-0">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sticky top-20">
        <h2 className="font-bold text-[#1a3a6b] text-sm mb-3 uppercase tracking-wide">Danh mục</h2>

        {/* Tất Cả Sản Phẩm */}
        <button
          onClick={navigateAll}
          className="w-full flex items-center gap-2.5 py-1.5 px-1 rounded-md hover:bg-gray-50 transition-colors group"
        >
          <span className={`w-4 h-4 rounded flex items-center justify-center border flex-shrink-0 transition-colors ${
            isAllSelected
              ? 'bg-[#1a56db] border-[#1a56db]'
              : 'border-gray-300 group-hover:border-[#1a56db]'
          }`}>
            {isAllSelected && (
              <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
                <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
          <span className={`text-sm font-semibold flex-1 text-left ${isAllSelected ? 'text-[#1a56db]' : 'text-gray-800'}`}>
            Tất Cả Sản Phẩm
          </span>
          <span className="text-xs text-gray-400">({totalCount})</span>
        </button>

        <div className="mt-3 space-y-1">
          {/* Branch: Văn Phòng Phẩm */}
          <BranchGroup
            branchKey="van-phong-pham"
            label="Văn Phòng Phẩm"
            icon="📋"
            color="blue"
            expanded={expandedBranches.has('van-phong-pham')}
            isSelected={selectedBranch === 'van-phong-pham' && selectedCategory === 'all'}
            branchCount={branchCount('van-phong-pham')}
            onToggleExpand={() => toggleBranch('van-phong-pham')}
            onSelectBranch={() => navigateBranch('van-phong-pham')}
          >
            {vpp.map((cat) => (
              <CategoryItem
                key={cat.slug}
                cat={cat}
                count={productCounts[cat.slug] ?? 0}
                isSelected={selectedCategory === cat.slug}
                color="blue"
                onClick={() => navigateCategory(cat.slug)}
              />
            ))}
          </BranchGroup>

          {/* Branch: Hàng Tiêu Dùng Thái Lan */}
          <BranchGroup
            branchKey="hang-thai-lan"
            label="Hàng Thái Lan"
            icon="🇹🇭"
            color="red"
            expanded={expandedBranches.has('hang-thai-lan')}
            isSelected={selectedBranch === 'hang-thai-lan' && selectedCategory === 'all'}
            branchCount={branchCount('hang-thai-lan')}
            onToggleExpand={() => toggleBranch('hang-thai-lan')}
            onSelectBranch={() => navigateBranch('hang-thai-lan')}
          >
            {thai.map((cat) => (
              <CategoryItem
                key={cat.slug}
                cat={cat}
                count={productCounts[cat.slug] ?? 0}
                isSelected={selectedCategory === cat.slug}
                color="red"
                onClick={() => navigateCategory(cat.slug)}
              />
            ))}
          </BranchGroup>
        </div>
      </div>
    </aside>
  )
}

// ─── Sub-components ───────────────────────────────────────────────

function BranchGroup({
  label,
  icon,
  color,
  expanded,
  isSelected,
  branchCount,
  onToggleExpand,
  onSelectBranch,
  children,
}: {
  branchKey: string
  label: string
  icon: string
  color: 'blue' | 'red'
  expanded: boolean
  isSelected: boolean
  branchCount: number
  onToggleExpand: () => void
  onSelectBranch: () => void
  children: React.ReactNode
}) {
  const activeColor = color === 'blue' ? '#1a56db' : '#dc2626'
  const hoverBg = color === 'blue' ? 'hover:bg-blue-50' : 'hover:bg-red-50'
  const checkBg = color === 'blue' ? 'bg-[#1a56db] border-[#1a56db]' : 'bg-[#dc2626] border-[#dc2626]'
  const labelColor = color === 'blue' ? 'text-[#1a3a6b]' : 'text-[#b91c1c]'

  return (
    <div>
      <div className={`flex items-center gap-1 rounded-md ${hoverBg} transition-colors`}>
        {/* Checkbox (click = select branch) */}
        <button
          onClick={onSelectBranch}
          className="flex items-center gap-2 flex-1 py-1.5 pl-1 min-w-0"
        >
          <span className={`w-4 h-4 rounded flex items-center justify-center border flex-shrink-0 transition-colors ${
            isSelected ? checkBg : 'border-gray-300'
          }`}>
            {isSelected && (
              <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
                <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
          <span className="text-base leading-none">{icon}</span>
          <span className={`text-sm font-semibold flex-1 text-left truncate ${isSelected ? labelColor : 'text-gray-800'}`}
            style={isSelected ? { color: activeColor } : undefined}
          >
            {label}
          </span>
          <span className="text-xs text-gray-400 pr-1">({branchCount})</span>
        </button>
        {/* Chevron toggle expand */}
        <button
          onClick={onToggleExpand}
          className="p-1.5 pr-2 text-gray-400 hover:text-gray-600 flex-shrink-0"
          aria-label={expanded ? 'Thu gọn' : 'Mở rộng'}
        >
          <svg
            className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {expanded && (
        <div className="ml-5 mt-0.5 space-y-0.5 border-l border-gray-100 pl-3">
          {children}
        </div>
      )}
    </div>
  )
}

function CategoryItem({
  cat,
  count,
  isSelected,
  color,
  onClick,
}: {
  cat: CategoryRow
  count: number
  isSelected: boolean
  color: 'blue' | 'red'
  onClick: () => void
}) {
  const checkBg = color === 'blue' ? 'bg-[#1a56db] border-[#1a56db]' : 'bg-[#dc2626] border-[#dc2626]'
  const hoverBg = color === 'blue' ? 'hover:bg-blue-50' : 'hover:bg-red-50'
  const activeText = color === 'blue' ? 'text-[#1a56db]' : 'text-[#dc2626]'

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 py-1.5 px-1 rounded-md transition-colors ${hoverBg}`}
    >
      <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border flex-shrink-0 transition-colors ${
        isSelected ? checkBg : 'border-gray-300'
      }`}>
        {isSelected && (
          <svg className="w-2 h-2 text-white" viewBox="0 0 10 10" fill="none">
            <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className="text-sm leading-none">{cat.icon}</span>
      <span className={`text-sm flex-1 text-left truncate ${isSelected ? activeText + ' font-medium' : 'text-gray-600'}`}>
        {cat.name}
      </span>
      <span className="text-xs text-gray-400">({count})</span>
    </button>
  )
}
