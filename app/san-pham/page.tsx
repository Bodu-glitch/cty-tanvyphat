import type { Metadata } from 'next'
import {
  getProductsFiltered,
  getProductCounts,
  getCategories,
  type SortBy,
  type SortDir,
  type PerPage,
} from '../../src/lib/supabase/server'
import ProductCard from '../../src/components/ProductCard'
import ProductFilter from '../../src/components/ProductFilter'
import ProductSearch from '../../src/components/ProductSearch'
import ProductPagination from '../../src/components/ProductPagination'

export const metadata: Metadata = {
  title: 'Sản Phẩm – Văn Phòng Phẩm & Hàng Tiêu Dùng Thái Lan',
  description:
    'Giấy in A4, bìa Thái, nhựa ép, văn phòng phẩm và hàng tiêu dùng Thái Lan nhập khẩu chính ngạch – giá sỉ tốt nhất. Hàng sẵn kho, giao toàn quốc.',
}

const VALID_PER_PAGE: PerPage[] = [50, 100, 200]

type PageProps = {
  searchParams: Promise<{
    category?: string
    branch?: string
    search?: string
    sort?: string
    dir?: string
    per_page?: string
    page?: string
  }>
}

export default async function SanPhamPage({ searchParams }: PageProps) {
  const {
    category: categoryParam,
    branch: branchParam,
    search: searchParam,
    sort: sortParam,
    dir: dirParam,
    per_page: perPageParam,
    page: pageParam,
  } = await searchParams

  const selectedCategory = categoryParam ?? 'all'
  const selectedBranch = branchParam ?? 'all'
  const searchText = searchParam ?? ''
  const sortBy: SortBy = sortParam === 'price' ? 'price' : 'name'
  const sortDir: SortDir = dirParam === 'desc' ? 'desc' : 'asc'
  const perPage: PerPage = VALID_PER_PAGE.includes(Number(perPageParam) as PerPage)
    ? (Number(perPageParam) as PerPage)
    : 50
  const page = Math.max(1, Number(pageParam) || 1)

  const [{ data: products, count }, categories, productCounts] = await Promise.all([
    getProductsFiltered({
      category: selectedCategory,
      branchSlug: selectedBranch,
      search: searchText,
      sortBy,
      sortDir,
      page,
      perPage,
    }),
    getCategories(),
    getProductCounts(),
  ])

  const totalPages = Math.ceil(count / perPage)

  const categoryMap = Object.fromEntries(categories.map((c) => [c.slug, c]))

  const totalCount = Object.values(productCounts).reduce((a, b) => a + b, 0)

  // Build href cho pagination — giữ nguyên tất cả params, chỉ đổi page
  const buildHref = (p: number) => {
    const params = new URLSearchParams()
    if (selectedCategory !== 'all') params.set('category', selectedCategory)
    if (selectedBranch !== 'all') params.set('branch', selectedBranch)
    if (searchText) params.set('search', searchText)
    if (sortBy !== 'name') params.set('sort', sortBy)
    if (sortDir !== 'asc') params.set('dir', sortDir)
    if (perPage !== 50) params.set('per_page', String(perPage))
    params.set('page', String(p))
    return `/san-pham?${params.toString()}`
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header — cùng cấu trúc để tránh nhảy layout */}
      {(() => {
        const headers = {
          'hang-thai-lan': {
            gradient: 'from-[#1a3a6b] to-[#1a56db]',
            subColor: 'text-blue-200',
            icon: '🇹🇭',
            title: 'Hàng Tiêu Dùng Thái Lan',
            sub: 'Nước giặt, nước xả, vệ sinh nhà cửa, chăm sóc cá nhân – nhập khẩu chính ngạch',
          },
          'van-phong-pham': {
            gradient: 'from-[#1a3a6b] to-[#1a56db]',
            subColor: 'text-blue-200',
            icon: '📋',
            title: 'Văn Phòng Phẩm',
            sub: 'Giấy in A4, bìa Thái, nhựa ép, tập vở, văn phòng phẩm – giá sỉ tốt nhất',
          },
          all: {
            gradient: 'from-[#1a3a6b] to-[#1a56db]',
            subColor: 'text-blue-200',
            icon: '🛍️',
            title: 'Sản phẩm',
            sub: 'Văn phòng phẩm & hàng tiêu dùng Thái Lan – giá sỉ tốt nhất, hàng sẵn kho',
          },
        }
        const h = headers[selectedBranch as keyof typeof headers] ?? headers.all
        return (
          <div className={`bg-gradient-to-r ${h.gradient} text-white py-10`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-3xl">{h.icon}</span>
                <h1 className="text-2xl md:text-3xl font-bold">{h.title}</h1>
              </div>
              <p className={`${h.subColor} text-sm`}>{h.sub}</p>
            </div>
          </div>
        )
      })()}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <ProductFilter
            categories={categories}
            productCounts={productCounts}
            totalCount={totalCount}
            selectedCategory={selectedCategory}
            selectedBranch={selectedBranch}
            searchText={searchText}
            sortBy={sortBy}
            sortDir={sortDir}
            perPage={perPage}
          />

          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <ProductSearch
                selectedCategory={selectedCategory}
                selectedBranch={selectedBranch}
                searchText={searchText}
                sortBy={sortBy}
                sortDir={sortDir}
                perPage={perPage}
                count={count}
              />
            </div>

            {products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product.slug}
                      product={product}
                      category={categoryMap[product.category]}
                    />
                  ))}
                </div>

                <ProductPagination
                  currentPage={page}
                  totalPages={totalPages}
                  buildHref={buildHref}
                />
              </>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Không tìm thấy sản phẩm
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  Thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác
                </p>
                <a
                  href="/san-pham"
                  className="inline-block bg-[#1a56db] hover:bg-[#1e40af] text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Xem tất cả sản phẩm
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
