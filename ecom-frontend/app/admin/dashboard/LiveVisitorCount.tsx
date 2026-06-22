'use client'
import { useEffect, useState } from 'react'

export default function LiveVisitorCount() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    async function fetchCount() {
      try {
        const res = await fetch('/api/admin/analytics/realtime', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          setCount(data.count ?? 0)
        }
      } catch {
        // silently fail — keep showing last known value
      }
    }

    fetchCount()
    const id = setInterval(fetchCount, 30_000)
    return () => clearInterval(id)
  }, [])

  const isActive = count !== null && count > 0

  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2 w-2 shrink-0">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isActive ? 'bg-green-400' : 'bg-gray-300'}`} />
        <span className={`relative inline-flex rounded-full h-2 w-2 ${isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
      </span>
      <span className="text-sm font-bold text-gray-800">
        {count === null ? '—' : count}
      </span>
      <span className="text-[10px] text-gray-400">online now</span>
    </div>
  )
}
