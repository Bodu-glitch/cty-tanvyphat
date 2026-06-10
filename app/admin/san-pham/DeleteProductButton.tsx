'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteProductButton({ id, name }: { id: number; name: string }) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    if (res.ok) {
      router.refresh()
    } else {
      alert('Xoá thất bại')
      setDeleting(false)
      setConfirming(false)
    }
  }

  if (confirming) {
    return (
      <span className="flex items-center gap-1.5 whitespace-nowrap">
        <span className="text-xs text-gray-500 hidden sm:inline">Xoá &quot;{name.slice(0, 12)}...&quot;?</span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-red-600 hover:underline text-xs font-medium disabled:opacity-50"
        >
          {deleting ? '...' : 'Xác nhận'}
        </button>
        <button onClick={() => setConfirming(false)} className="text-gray-400 hover:text-gray-600 text-xs">
          Huỷ
        </button>
      </span>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-red-500 hover:underline text-xs"
    >
      Xoá
    </button>
  )
}
