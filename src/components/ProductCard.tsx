import Link from 'next/link'
import type { ProductRow, CategoryRow } from '../lib/supabase/server'
import { store } from '../data/store'

interface ProductCardProps {
  product: ProductRow
  category?: CategoryRow
}

export default function ProductCard({ product, category }: ProductCardProps) {
  const hasImage = product.images.length > 0

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col overflow-hidden group">
      {/* Image / Fallback */}
      <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
        {hasImage ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <span className="text-5xl">{category?.icon ?? '📦'}</span>
            <span className="text-sm text-blue-600 font-medium text-center px-2">
              {product.name}
            </span>
          </div>
        )}
        {/* Category badge */}
        <div className="absolute top-2 left-2">
          <span className="bg-[#1a56db] text-white text-xs font-semibold px-2 py-1 rounded-full">
            {category?.name ?? product.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <h3 className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2 group-hover:text-[#1a56db] transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2 flex-1 leading-relaxed">
          {product.description}
        </p>
        <p className="text-amber-600 font-semibold text-xs mt-1">Liên hệ báo giá</p>

        {/* Actions */}
        <div className="flex gap-2 mt-2">
          <Link
            href={`/san-pham/${product.slug}`}
            className="flex-1 text-center text-xs bg-[#1a56db] hover:bg-[#1e40af] text-white font-medium py-2 px-3 rounded-lg transition-colors"
          >
            Xem chi tiết
          </Link>
          <a
            href={`tel:${store.phone}`}
            className="flex-1 text-center text-xs bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-3 rounded-lg transition-colors"
          >
            Đặt hàng
          </a>
        </div>
      </div>
    </div>
  )
}
