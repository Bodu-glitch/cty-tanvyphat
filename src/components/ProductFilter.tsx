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
  sortBy: string
  sortDir: string
  perPage: number
}

export default function ProductFilter({
  categories,
  productCounts,
  totalCount,
  selectedCategory,
  selectedBranch,
  searchText,
  sortBy,
  sortDir,
  perPage,
}: ProductFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [, startTransition] = useTransition()
  const [expandedBranches, setExpandedBranches] = useState<Set<string>>(
    () => new Set(['van-phong-pham', 'hang-thai-lan'])
  )
  const [drawerOpen, setDrawerOpen] = useState(false)

  const buildParams = useCallback(
    (overrides: Record<string, string>) => {
      const params = new URLSearchParams()
      if (searchText.trim()) params.set('search', searchText.trim())
      if (sortBy !== 'name') params.set('sort', sortBy)
      if (sortDir !== 'asc') params.set('dir', sortDir)
      if (perPage !== 50) params.set('per_page', String(perPage))
      for (const [k, v] of Object.entries(overrides)) {
        if (v) params.set(k, v)
        else params.delete(k)
      }
      return params.toString()
    },
    [searchText, sortBy, sortDir, perPage]
  )

  const go = useCallback(
    (qs: string) => {
      setDrawerOpen(false)
      startTransition(() => { router.push(qs ? `${pathname}?${qs}` : pathname) })
    },
    [router, pathname]
  )

  const navigateAll    = useCallback(() => go(buildParams({})), [go, buildParams])
  const navigateBranch = useCallback((branch: string) => go(buildParams({ branch })), [go, buildParams])
  const navigateCategory = useCallback((slug: string) => go(buildParams({ category: slug })), [go, buildParams])

  const toggleBranch = (branch: string) => {
    setExpandedBranches((prev) => {
      const next = new Set(prev)
      if (next.has(branch)) next.delete(branch)
      else next.add(branch)
      return next
    })
  }

  const isAllSelected = selectedCategory === 'all' && selectedBranch === 'all'
  const vpp  = categories.filter((c) => c.branch_slug === 'van-phong-pham')
  const thai = categories.filter((c) => c.branch_slug === 'hang-thai-lan')

  const branchCount = (branchSlug: string) =>
    categories
      .filter((c) => c.branch_slug === branchSlug)
      .reduce((sum, c) => sum + (productCounts[c.slug] ?? 0), 0)

  const navContent = (
    <nav className="space-y-0.5">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Danh mục</p>

      <button
        onClick={navigateAll}
        className={`w-full flex items-center justify-between px-1 py-1.5 rounded-md text-sm transition-colors ${
          isAllSelected ? 'text-[#1a56db] font-semibold' : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <span>Tất cả sản phẩm</span>
        <span className={`text-xs tabular-nums ${isAllSelected ? 'text-[#1a56db]' : 'text-gray-400'}`}>
          {totalCount}
        </span>
      </button>

      <div className="pt-2 space-y-0.5">
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
    </nav>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block lg:w-52 shrink-0">
        <div className="lg:sticky lg:top-20">
          {navContent}
        </div>
      </aside>

      {/* Mobile: nút mở drawer */}
      <button
        onClick={() => setDrawerOpen(true)}
        className="lg:hidden fixed bottom-6 left-4 z-30 flex items-center gap-2 bg-[#1a56db] text-white pl-3 pr-4 py-2.5 rounded-full shadow-lg text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        Danh mục
      </button>

      {/* Mobile: backdrop */}
      <div
        onClick={() => setDrawerOpen(false)}
        className={`lg:hidden fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Mobile: drawer panel */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 w-72 bg-white z-50 p-6 overflow-y-auto shadow-xl transition-transform duration-300 ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between mb-5">
          <span className="font-semibold text-gray-900">Danh mục</span>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-md"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {navContent}
      </div>
    </>
  )
}

// ─── Sub-components ───────────────────────────────────────────────

function BranchGroup({
  label, icon, color, expanded, isSelected, branchCount, onToggleExpand, onSelectBranch, children,
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
  const activeText = color === 'blue' ? 'text-[#1a56db]' : 'text-[#dc2626]'
  const activeDot  = color === 'blue' ? 'bg-[#1a56db]'   : 'bg-[#dc2626]'

  return (
    <div>
      <div className="flex items-center">
        <span className={`w-1 h-1 rounded-full mr-2 flex-shrink-0 transition-all ${isSelected ? activeDot : 'bg-transparent'}`} />
        <button
          onClick={onSelectBranch}
          className={`flex items-center gap-1.5 flex-1 py-1.5 text-sm font-semibold transition-colors ${
            isSelected ? activeText : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          <span className="text-base leading-none">{icon}</span>
          <span className="flex-1 text-left truncate">{label}</span>
          <span className={`text-xs font-normal tabular-nums mr-1 ${isSelected ? activeText : 'text-gray-400'}`}>
            {branchCount}
          </span>
        </button>
        <button
          onClick={onToggleExpand}
          className="p-1 text-gray-400 hover:text-gray-600"
          aria-label={expanded ? 'Thu gọn' : 'Mở rộng'}
        >
          <svg
            className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      {expanded && (
        <div className="ml-3 mt-0.5 pl-3 border-l border-gray-200 space-y-0.5">
          {children}
        </div>
      )}
    </div>
  )
}

function CategoryItem({
  cat, count, isSelected, color, onClick,
}: {
  cat: CategoryRow
  count: number
  isSelected: boolean
  color: 'blue' | 'red'
  onClick: () => void
}) {
  const activeText = color === 'blue' ? 'text-[#1a56db]' : 'text-[#dc2626]'

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 py-1.5 px-1 text-sm transition-colors ${
        isSelected ? `${activeText} font-medium` : 'text-gray-500 hover:text-gray-900'
      }`}
    >
      <span className="text-sm leading-none">{cat.icon}</span>
      <span className="flex-1 text-left truncate">{cat.name}</span>
      <span className={`text-xs tabular-nums ${isSelected ? activeText : 'text-gray-400'}`}>{count}</span>
    </button>
  )
}
