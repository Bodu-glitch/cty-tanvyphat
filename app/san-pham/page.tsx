'use client'

import { useState } from 'react'
import { products } from '../../src/data/products'
import { categories } from '../../src/data/categories'
import ProductCard from '../../src/components/ProductCard'

export default function SanPhamPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchText, setSearchText] = useState('')

  const filtered = products.filter((p) => {
    const matchCat = selectedCategory === 'all' || p.category === selectedCategory
    const matchSearch =
      searchText.trim() === '' ||
      p.name.toLowerCase().includes(searchText.toLowerCase()) ||
      p.description.toLowerCase().includes(searchText.toLowerCase())
    return matchCat && matchSearch
  })

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
          {/* Sidebar / Filters */}
          <aside className="lg:w-56 shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sticky top-20">
              <h2 className="font-bold text-[#1a3a6b] text-base mb-4">Danh mục</h2>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-[#1a56db] text-white'
                      : 'text-gray-700 hover:bg-blue-50 hover:text-[#1a56db]'
                  }`}
                >
                  Tất cả sản phẩm
                  <span className="ml-2 text-xs opacity-70">({products.length})</span>
                </button>
                {categories.map((cat) => {
                  const count = products.filter((p) => p.category === cat.slug).length
                  return (
                    <button
                      key={cat.slug}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                        selectedCategory === cat.slug
                          ? 'bg-[#1a56db] text-white'
                          : 'text-gray-700 hover:bg-blue-50 hover:text-[#1a56db]'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span className="flex-1">{cat.name}</span>
                      <span className="text-xs opacity-70">({count})</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Search + Count */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56db] focus:border-transparent bg-white"
                />
              </div>
              <div className="flex items-center text-sm text-gray-500 bg-white border border-gray-200 rounded-xl px-4 py-2.5 whitespace-nowrap">
                <span>
                  <span className="font-semibold text-[#1a56db]">{filtered.length}</span> sản phẩm
                </span>
              </div>
            </div>

            {/* Products Grid */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((product) => (
                  <ProductCard key={product.slug} product={product} />
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
                <button
                  onClick={() => {
                    setSelectedCategory('all')
                    setSearchText('')
                  }}
                  className="bg-[#1a56db] hover:bg-[#1e40af] text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Xem tất cả sản phẩm
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
