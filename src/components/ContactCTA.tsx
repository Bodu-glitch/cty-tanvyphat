'use client'

import { store } from '../data/store'

export default function ContactCTA() {
  return (
    <div className="fixed bottom-6 right-4 z-50 flex flex-col items-end gap-3">
      {/* Phone Button */}
      <a
        href={`tel:${store.phone}`}
        className="flex items-center gap-2 bg-[#1a56db] hover:bg-[#1e40af] text-white px-3 py-2.5 rounded-full shadow-lg transition-all hover:scale-105 group"
        aria-label="Gọi điện"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
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
        <span className="text-sm font-semibold hidden sm:inline">{store.phoneDisplay}</span>
      </a>

      {/* Facebook Button */}
      <a
        href={store.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-[#1877F2] hover:bg-[#0c63d4] text-white px-3 py-2.5 rounded-full shadow-lg transition-all hover:scale-105"
        aria-label="Facebook"
      >
        <svg
          className="w-5 h-5 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        <span className="text-sm font-semibold hidden sm:inline">Facebook</span>
      </a>

      {/* Zalo Button */}
      <a
        href={store.zalo}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-[#0068FF] hover:bg-[#0054cc] text-white px-3 py-2.5 rounded-full shadow-lg transition-all hover:scale-105"
        aria-label="Zalo"
      >
        <svg className="w-5 h-5" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16" fill="white" fillOpacity="0.2" />
          <text
            x="50%"
            y="55%"
            dominantBaseline="middle"
            textAnchor="middle"
            fill="white"
            fontSize="11"
            fontWeight="bold"
            fontFamily="Arial, sans-serif"
          >
            Zalo
          </text>
        </svg>
        <span className="text-sm font-semibold hidden sm:inline">Zalo</span>
      </a>
    </div>
  )
}
