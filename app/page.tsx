import Link from 'next/link'
import { store } from '../src/data/store'
import { categories } from '../src/data/categories'
import { products } from '../src/data/products'
import ProductCard from '../src/components/ProductCard'

const featuredProducts = products.filter((p) => p.featured)

const uspItems = [
  {
    icon: '💰',
    title: 'Giá sỉ tận gốc',
    desc: 'Nhập trực tiếp từ nhà sản xuất, không qua trung gian. Giá cạnh tranh nhất thị trường.',
  },
  {
    icon: '🚚',
    title: 'Giao hàng toàn quốc',
    desc: 'Ship toàn quốc nhanh chóng, đóng gói cẩn thận. Giao hàng nội thành TPHCM trong ngày.',
  },
  {
    icon: '✅',
    title: 'Hàng chính hãng',
    desc: 'Cam kết 100% hàng chính hãng, đầy đủ chứng từ nhập khẩu. Đổi trả nếu không đúng.',
  },
  {
    icon: '📞',
    title: 'Hỗ trợ 24/7',
    desc: 'Đội ngũ tư vấn nhiệt tình, hỗ trợ báo giá nhanh. Gọi ngay để được tư vấn miễn phí.',
  },
]

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1a3a6b] via-[#1a56db] to-[#1e40af] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at 2px 2px, #ffffff 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-500 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6 shadow-md">
              <span>🏪</span>
              <span>Q.12, TPHCM · Ship toàn quốc</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-4 drop-shadow-sm">
              {store.name}
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 font-medium mb-3">{store.tagline}</p>
            <p className="text-blue-200 text-base mb-8 leading-relaxed">
              Cung cấp giấy in A4, văn phòng phẩm, bìa Thái, nhựa ép dẻo và nhiều sản phẩm khác
              với giá sỉ tốt nhất. Hàng sẵn kho, giao nhanh toàn quốc.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/san-pham"
                className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-white font-bold px-8 py-3.5 rounded-xl text-base transition-colors shadow-lg hover:shadow-xl"
              >
                <span>Xem sản phẩm</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <a
                href={`tel:${store.phone}`}
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-colors"
              >
                <svg
                  className="w-4 h-4"
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
                Liên hệ ngay
              </a>
            </div>
          </div>
        </div>
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path
              d="M0 48H1440V20C1200 48 960 4 720 4C480 4 240 48 0 20V48Z"
              fill="#f8fafc"
            />
          </svg>
        </div>
      </section>

      {/* USP Section */}
      <section className="py-12 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {uspItems.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-[#1a3a6b] text-base mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a3a6b] mb-2">
              Danh mục sản phẩm
            </h2>
            <p className="text-gray-500 text-sm">Đa dạng sản phẩm giấy in và văn phòng phẩm</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/san-pham?category=${cat.slug}`}
                className="group bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-[#1a56db] hover:to-[#1e40af] rounded-xl p-5 text-center transition-all shadow-sm hover:shadow-md border border-blue-100 hover:border-[#1a56db]"
              >
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform inline-block">
                  {cat.icon}
                </div>
                <h3 className="font-semibold text-[#1a3a6b] group-hover:text-white text-sm mb-1 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-gray-500 group-hover:text-blue-100 text-xs leading-snug transition-colors">
                  {cat.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1a3a6b]">Sản phẩm nổi bật</h2>
              <p className="text-gray-500 text-sm mt-1">Hàng sẵn kho, giá tốt nhất</p>
            </div>
            <Link
              href="/san-pham"
              className="text-[#1a56db] hover:text-[#1e40af] text-sm font-semibold flex items-center gap-1 transition-colors"
            >
              Xem tất cả
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* About Mini */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a3a6b] mb-4">
              Về CT Tân Vy Phát
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Tân Vy Phát là đơn vị chuyên phân phối giấy in A4 và văn phòng phẩm giá sỉ tại
              Q.12, TPHCM. Chúng tôi nhập hàng trực tiếp từ nhà máy sản xuất trong nước và nhập
              khẩu, đảm bảo giá tốt nhất cho các đại lý, văn phòng, trường học và tiệm văn phòng
              phẩm trên toàn quốc.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8">
              {[
                { value: '718+', label: 'Khách hàng' },
                { value: 'Toàn quốc', label: 'Giao hàng' },
                { value: '5+', label: 'Năm kinh nghiệm' },
                { value: 'Q.12 HCM', label: 'Địa chỉ kho' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-extrabold text-[#1a56db] mb-1">{stat.value}</div>
                  <div className="text-gray-500 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-12 bg-gradient-to-r from-[#1a3a6b] to-[#1a56db] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Liên hệ ngay để được báo giá tốt nhất!
          </h2>
          <p className="text-blue-200 mb-6 text-base">
            Gọi hotline hoặc nhắn tin qua Facebook / Zalo – phản hồi trong vài phút
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a
              href={`tel:${store.phone}`}
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white font-bold px-8 py-3.5 rounded-xl text-lg transition-colors shadow-lg"
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
              {store.phoneDisplay}
            </a>
            <a
              href={store.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#1877F2] hover:bg-[#0c63d4] text-white font-semibold px-6 py-3.5 rounded-xl transition-colors"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </a>
            <a
              href={store.zalo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#0068FF] hover:bg-[#0054cc] text-white font-semibold px-6 py-3.5 rounded-xl transition-colors"
            >
              Zalo
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
