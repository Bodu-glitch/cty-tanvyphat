'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useRef, useTransition } from 'react'

type Props = {
  selectedCategory: string
  selectedBranch: string
  searchText: string
  sortBy: string
  sortDir: string
  perPage: number
  count: number
}

const SORT_OPTIONS = [
  { label: 'Tên A→Z',      value: 'name|asc' },
  { label: 'Tên Z→A',      value: 'name|desc' },
  { label: 'Giá thấp→cao', value: 'price|asc' },
  { label: 'Giá cao→thấp', value: 'price|desc' },
]

export default function ProductSearch({
  selectedCategory,
  selectedBranch,
  searchText,
  sortBy,
  sortDir,
  perPage,
  count,
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const navigate = useCallback(
    (overrides: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())
      for (const [k, v] of Object.entries(overrides)) {
        if (v) params.set(k, v)
        else params.delete(k)
      }
      params.delete('page')
      const qs = params.toString()
      startTransition(() => { router.push(qs ? `${pathname}?${qs}` : pathname) })
    },
    [router, pathname, searchParams]
  )

  const searchNow = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    navigate({ search: inputRef.current?.value.trim() ?? '' })
  }

  const handleChange = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(searchNow, 500)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') searchNow()
  }

  const handleSort = (value: string) => {
    const [sort, dir] = value.split('|')
    navigate({ sort: sort === 'name' ? '' : sort, dir: dir === 'asc' ? '' : dir })
  }

  const handlePerPage = (value: string) => {
    navigate({ per_page: value === '50' ? '' : value })
  }

  const sortValue = `${sortBy}|${sortDir}`

  /*
   * Grid layout:
   *   Mobile  (3 col): [search flex-1] [Tìm] [count]
   *                    [sort   span-2        ] [pp  ]
   *   Desktop (5 col): [search flex-1] [Tìm] [sort] [pp] [count]
   */
  return (
    <div className="grid gap-2 items-center
      grid-cols-[1fr_auto_auto]
      md:grid-cols-[1fr_auto_auto_auto_auto]"
    >
      {/* search input — row1 col1 */}
      <div className="relative row-start-1 col-start-1">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          defaultValue={searchText}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56db] focus:border-transparent bg-white"
        />
      </div>

      {/* Tìm button — row1 col2 */}
      <button
        onClick={searchNow}
        className="row-start-1 col-start-2 shrink-0 px-4 py-2.5 bg-[#1a56db] hover:bg-[#1e40af] text-white text-sm font-medium rounded-xl transition-colors"
      >
        Tìm
      </button>

      {/* count — row1 col3 mobile / row1 col5 desktop */}
      <div className="row-start-1 col-start-3 md:col-start-5 shrink-0 text-sm text-gray-500 bg-white border border-gray-200 rounded-xl px-3 py-2.5 whitespace-nowrap text-center">
        <span className="font-semibold text-[#1a56db]">{count}</span> sản phẩm
      </div>

      {/* sort dropdown — row2 col1-2 mobile / row1 col3 desktop */}
      <div className="relative row-start-2 col-start-1 col-span-2 md:row-start-1 md:col-start-3 md:col-span-1">
        <select
          value={sortValue}
          onChange={(e) => handleSort(e.target.value)}
          className="w-full appearance-none bg-white border border-gray-200 rounded-xl text-sm text-gray-600 pl-3 pr-8 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1a56db] focus:border-transparent cursor-pointer"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* per-page dropdown — row2 col3 mobile / row1 col4 desktop */}
      <div className="relative row-start-2 col-start-3 md:row-start-1 md:col-start-4">
        <select
          value={String(perPage)}
          onChange={(e) => handlePerPage(e.target.value)}
          className="w-full appearance-none bg-white border border-gray-200 rounded-xl text-sm text-gray-600 pl-3 pr-8 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1a56db] focus:border-transparent cursor-pointer"
        >
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="200">200</option>
        </select>
        <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  )
}
