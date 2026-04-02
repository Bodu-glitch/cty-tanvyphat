'use client'

import { useState, useEffect } from 'react'
import ProductCard from './ProductCard'
import type { ProductRow, CategoryRow } from '../lib/supabase/server'

interface Props {
  products: ProductRow[]
  categoryMap: Record<string, CategoryRow>
}

export default function FeaturedCarousel({ products, categoryMap }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(3)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 1280) setItemsPerPage(4)
      else if (window.innerWidth >= 1024) setItemsPerPage(3)
      else if (window.innerWidth >= 640) setItemsPerPage(2)
      else setItemsPerPage(1)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const maxIndex = Math.max(0, products.length - itemsPerPage)

  useEffect(() => {
    setCurrentIndex((i) => Math.min(i, maxIndex))
  }, [maxIndex])

  useEffect(() => {
    if (isPaused || products.length === 0) return
    const timer = setInterval(() => {
      setCurrentIndex((i) => (i >= maxIndex ? 0 : i + 1))
    }, 4000)
    return () => clearInterval(timer)
  }, [maxIndex, isPaused, products.length])

  const prev = () => setCurrentIndex((i) => Math.max(0, i - 1))
  const next = () => setCurrentIndex((i) => Math.min(maxIndex, i + 1))

  const itemWidth = 100 / itemsPerPage

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Track */}
      <div className="overflow-hidden px-1">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * itemWidth}%)` }}
        >
          {products.map((product) => (
            <div
              key={product.slug}
              className="flex-none px-3"
              style={{ width: `${itemWidth}%` }}
            >
              <ProductCard product={product} category={categoryMap[product.category]} />
            </div>
          ))}
        </div>
      </div>

      {/* Prev button */}
      {currentIndex > 0 && (
        <button
          onClick={prev}
          aria-label="Trước"
          className="absolute left-0 top-1/2 -translate-y-8 -translate-x-5 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-[#1a56db] hover:text-white hover:border-[#1a56db] transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Next button */}
      {currentIndex < maxIndex && (
        <button
          onClick={next}
          aria-label="Tiếp theo"
          className="absolute right-0 top-1/2 -translate-y-8 translate-x-5 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-[#1a56db] hover:text-white hover:border-[#1a56db] transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Dot indicators */}
      {maxIndex > 0 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Trang ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? 'w-6 h-2.5 bg-[#1a56db]'
                  : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
