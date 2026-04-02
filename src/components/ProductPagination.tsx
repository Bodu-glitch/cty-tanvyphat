import Link from 'next/link'

type Props = {
  currentPage: number
  totalPages: number
  buildHref: (page: number) => string
}

export default function ProductPagination({ currentPage, totalPages, buildHref }: Props) {
  if (totalPages <= 1) return null

  // Hiển thị tối đa 7 trang: đầu, cuối, và xung quanh trang hiện tại
  const pages: (number | 'ellipsis')[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (currentPage > 3) pages.push('ellipsis')
    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    if (currentPage < totalPages - 2) pages.push('ellipsis')
    pages.push(totalPages)
  }

  const btnBase = 'flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium transition-colors border'
  const btnActive = 'bg-[#1a56db] border-[#1a56db] text-white'
  const btnNormal = 'bg-white border-gray-200 text-gray-600 hover:border-[#1a56db] hover:text-[#1a56db]'
  const btnDisabled = 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed'

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      {/* Prev */}
      {currentPage > 1 ? (
        <Link href={buildHref(currentPage - 1)} className={`${btnBase} ${btnNormal}`}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
      ) : (
        <span className={`${btnBase} ${btnDisabled}`}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </span>
      )}

      {pages.map((p, i) =>
        p === 'ellipsis' ? (
          <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(p)}
            className={`${btnBase} ${p === currentPage ? btnActive : btnNormal}`}
          >
            {p}
          </Link>
        )
      )}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link href={buildHref(currentPage + 1)} className={`${btnBase} ${btnNormal}`}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ) : (
        <span className={`${btnBase} ${btnDisabled}`}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      )}
    </div>
  )
}
