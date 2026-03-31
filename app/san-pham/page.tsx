import type { Metadata } from 'next'
import { getProducts, getCategories } from '../../src/lib/supabase/server'
import ProductCard from '../../src/components/ProductCard'
import ProductFilter from '../../src/components/ProductFilter'
import ProductSearch from '../../src/components/ProductSearch'

export const metadata: Metadata = {
  title: 'Sản Phẩm – Giấy In & VPP Giá Sỉ',
  description:
    'Xem toàn bộ sản phẩm: giấy in A4, bìa Thái, nhựa ép, văn phòng phẩm, tập vở – giá sỉ tốt nhất TPHCM. Hàng chính hãng, giao toàn quốc.',
}

type PageProps = {
  searchParams: Promise<{ category?: string; search?: string }>
}

export default async function SanPhamPage({ searchParams }: PageProps) {
  const { category: categoryParam, search: searchParam } = await searchParams

  const selectedCategory = categoryParam ?? 'all'
  const searchText = searchParam ?? ''

  const [allProducts, categories] = await Promise.all([getProducts(), getCategories()])

  const filtered = allProducts.filter((p) => {
    const matchCat = selectedCategory === 'all' || p.category === selectedCategory
    const matchSearch =
      searchText.trim() === '' ||
      p.name.toLowerCase().includes(searchText.toLowerCase()) ||
      p.description.toLowerCase().includes(searchText.toLowerCase())
    return matchCat && matchSearch
  })

  const productCounts: Record<string, number> = Object.fromEntries(
    categories.map((cat) => [cat.slug, allProducts.filter((p) => p.category === cat.slug).length])
  )

  const categoryMap = Object.fromEntries(categories.map((c) => [c.slug, c]))

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#1a3a6b] to-[#1a56db] text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Sản phẩm</h1>
          <p className="text-blue-200 text-sm">
            Giấy in A4, văn phòng phẩm, bìa Thái, nhựa ép – giá sỉ tốt nhất
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ProductFilter: sidebar danh mục + ô tìm kiếm (client component) */}
          <ProductFilter
            categories={categories}
            productCounts={productCounts}
            totalCount={allProducts.length}
            selectedCategory={selectedCategory}
            searchText={searchText}
          />

          {/* Lưới sản phẩm — server-rendered HTML, Google crawl được đầy đủ */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <ProductSearch selectedCategory={selectedCategory} searchText={searchText} />
              <div className="flex items-center text-sm text-gray-500 bg-white border border-gray-200 rounded-xl px-4 py-2.5 whitespace-nowrap">
                <span>
                  <span className="font-semibold text-[#1a56db]">{filtered.length}</span> sản phẩm
                </span>
              </div>
            </div>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((product) => (
                  <ProductCard
                    key={product.slug}
                    product={product}
                    category={categoryMap[product.category]}
                  />
                ))}
              </div>
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
