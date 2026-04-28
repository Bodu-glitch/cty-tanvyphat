'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ArrowRight, Phone, Sparkles } from 'lucide-react'
import { store } from '@/src/data/store'

const slides = [
  { src: '/carousel/slide-1.jpg', alt: 'Giấy in chính hãng' },
  { src: '/carousel/slide-2.jpg', alt: 'Văn phòng phẩm giá sỉ' },
  { src: null, alt: 'Sắp ra mắt' },
]

const stats = [
  { value: '5.868+', label: 'Khách hàng' },
  { value: '17+', label: 'Năm kinh nghiệm' },
  { value: 'Toàn quốc', label: 'Giao hàng' },
]

const N = slides.length

export default function BannerCarousel() {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const prev = useCallback(() => setCurrent((i) => (i === 0 ? N - 1 : i - 1)), [])
  const next = useCallback(() => setCurrent((i) => (i === N - 1 ? 0 : i + 1)), [])

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [isPaused, next])

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-sky-50 overflow-hidden py-16 md:py-24">
      {/* Decorative blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute -bottom-16 -right-24 w-[28rem] h-[28rem] bg-sky-100 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Left: Text */}
          <div className="w-full lg:w-[55%] z-10">
            <div className="inline-flex items-center gap-1.5 bg-blue-100 text-[#1a56db] text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              Phân phối giá sỉ tận gốc ✨
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-[#1a3a6b] leading-tight mb-4">
              Giấy In &amp; Văn Phòng Phẩm<br />
              <span className="text-[#1a56db]">Giá Sỉ Tận Gốc</span>
            </h1>

            <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-lg">
              Chuyên phân phối giấy in, văn phòng phẩm và hàng tiêu dùng Thái Lan tại Q.12, TPHCM.
              Hàng chính hãng, xuất hóa đơn VAT, giao toàn quốc.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 mb-10">
              <Link
                href="/san-pham"
                className="inline-flex items-center gap-2 bg-[#1a3a6b] hover:bg-[#1a56db] text-white font-bold px-7 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-blue-200"
              >
                Xem sản phẩm
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={`tel:${store.phone}`}
                className="inline-flex items-center gap-2 border-2 border-[#1a3a6b] text-[#1a3a6b] hover:bg-[#1a3a6b] hover:text-white font-semibold px-6 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
              >
                <Phone className="w-4 h-4" />
                {store.phoneDisplay}
              </a>
            </div>

            {/* Stats */}
            <div className="flex gap-8 sm:gap-12">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-extrabold text-[#1a56db]">{s.value}</div>
                  <div className="text-gray-500 text-sm mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Carousel */}
          <div
            className="w-full lg:w-[45%] z-10"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="relative">
              {/* Image frame */}
              <div className="relative overflow-hidden rounded-2xl shadow-2xl aspect-[4/3] bg-gray-100">
                {slides.map((slide, i) =>
                  slide.src ? (
                    <div
                      key={i}
                      className={`absolute inset-0 transition-opacity duration-500 ${
                        i === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
                      }`}
                    >
                      <Image
                        src={slide.src}
                        alt={slide.alt}
                        fill
                        className="object-cover"
                        priority={i === 0}
                        sizes="(max-width: 1024px) 100vw, 45vw"
                      />
                    </div>
                  ) : (
                    <div
                      key={i}
                      className={`absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-gray-100 to-gray-200 transition-opacity duration-500 ${
                        i === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
                      }`}
                    >
                      <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18M3 3h18" />
                      </svg>
                      <span className="text-gray-400 text-sm font-medium">Ảnh sắp ra mắt</span>
                    </div>
                  )
                )}

                {/* Bottom gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none rounded-2xl" />
              </div>

              {/* Prev button */}
              <button
                onClick={prev}
                aria-label="Trước"
                className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-[#1a3a6b] hover:bg-[#1a3a6b] hover:text-white transition-all duration-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Next button */}
              <button
                onClick={next}
                aria-label="Tiếp theo"
                className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-[#1a3a6b] hover:bg-[#1a3a6b] hover:text-white transition-all duration-200"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Dots */}
              <div className="flex justify-center gap-2 mt-5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    aria-label={`Slide ${i + 1}`}
                    className={`rounded-full transition-all duration-300 ${
                      i === current
                        ? 'w-6 h-2.5 bg-[#1a3a6b]'
                        : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
