import Link from 'next/link'
import { products } from '../../../src/data/products'
import { categories } from '../../../src/data/categories'
import { store } from '../../../src/data/store'
import ProductCard from '../../../src/components/ProductCard'

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = products.find((p) => p.slug === slug)

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="text-center py-20 px-4">
          <div className="text-7xl mb-4">📦</div>
          <h1 className="text-2xl font-bold text-[#1a3a6b] mb-3">Sản phẩm không tồn tại</h1>
          <p className="text-gray-500 mb-6">
            Sản phẩm bạn tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Link
            href="/san-pham"
            className="inline-flex items-center gap-2 bg-[#1a56db] hover:bg-[#1e40af] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại danh sách sản phẩm
          </Link>
        </div>
      </div>
    )
  }

  const category = categories.find((c) => c.slug === product.category)
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 4)
  const hasImage = product.images.length > 0

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#1a56db] transition-colors">
              Trang chủ
            </Link>
            <span>›</span>
            <Link href="/san-pham" className="hover:text-[#1a56db] transition-colors">
              Sản phẩm
            </Link>
            <span>›</span>
            {category && (
              <>
                <Link
                  href={`/san-pham?category=${category.slug}`}
                  className="hover:text-[#1a56db] transition-colors"
                >
                  {category.name}
                </Link>
                <span>›</span>
              </>
            )}
            <span className="text-[#1a3a6b] font-medium truncate max-w-[200px]">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Image */}
            <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 min-h-72 md:min-h-96 flex items-center justify-center">
              {hasImage ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover max-h-96"
                />
              ) : (
                <div className="text-center py-12 px-8">
                  <div className="text-8xl mb-4">{category?.icon ?? '📦'}</div>
                  <p className="text-blue-500 font-medium text-lg">{product.name}</p>
                </div>
              )}
              {/* Category badge */}
              <div className="absolute top-4 left-4">
                <span className="bg-[#1a56db] text-white text-sm font-semibold px-3 py-1.5 rounded-full shadow-md">
                  {category?.icon} {category?.name ?? product.category}
                </span>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-6 md:p-8 flex flex-col">
              <h1 className="text-2xl md:text-3xl font-bold text-[#1a3a6b] mb-4 leading-snug">
                {product.name}
              </h1>

              {/* Price */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                <p className="text-amber-700 font-semibold text-sm">Giá bán:</p>
                <p className="text-amber-600 font-bold text-xl">
                  Liên hệ để được báo giá sỉ tốt nhất
                </p>
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed text-sm mb-6 flex-1">
                {product.description}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-3">
                <a
                  href={`tel:${store.phone}`}
                  className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3.5 rounded-xl text-base transition-colors shadow-md"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  Gọi điện: {store.phoneDisplay}
                </a>
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={store.zalo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#0068FF] hover:bg-[#0054cc] text-white font-semibold px-4 py-3 rounded-xl text-sm transition-colors"
                  >
                    Nhắn Zalo
                  </a>
                  <a
                    href={store.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#0c63d4] text-white font-semibold px-4 py-3 rounded-xl text-sm transition-colors"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </a>
                </div>
              </div>

              {/* Contact note */}
              <p className="text-xs text-gray-400 mt-4 text-center">
                Địa chỉ: {store.address}
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-[#1a3a6b] mb-5">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rp) => (
                <ProductCard key={rp.slug} product={rp} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
