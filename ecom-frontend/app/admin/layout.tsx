import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import AdminNav from './AdminNav'
import { requireAdmin } from '@/lib/admin-auth'
import { AdminThemeProvider } from './AdminThemeProvider'
import { AdminThemeToggle } from './AdminThemeToggle'

export const dynamic = 'force-dynamic'

function getInitials(name: string) {
  return name.split(/\s+/).map(n => n[0] ?? '').join('').toUpperCase().slice(0, 2) || '?'
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await requireAdmin()

  const displayName = profile.full_name || user.email?.split('@')[0] || 'Admin'
  const email       = user.email ?? ''
  const initials    = getInitials(displayName)

  return (
    <AdminThemeProvider>
      <div className="admin-wrapper flex h-screen overflow-hidden bg-gray-100 dark:bg-[#0c0e17]">

        {/* ── Sidebar ── */}
        <aside
          className="w-55 shrink-0 h-full flex flex-col select-none"
          style={{ background: 'linear-gradient(175deg, #0d0f1c 0%, #10121f 60%, #0e1019 100%)' }}
        >

          {/* User header */}
          <div className="px-4 pt-5 pb-3.5">
            <div className="flex items-center gap-3">
              <div className="
                w-8 h-8 rounded-full shrink-0 flex items-center justify-center
                text-white text-[11px] font-bold tracking-wide
                bg-linear-to-br from-indigo-500 via-violet-500 to-purple-600
                shadow-[0_0_12px_rgba(139,92,246,0.5)] ring-1 ring-white/10
              ">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white text-[13px] font-semibold truncate leading-tight">{displayName}</p>
                <p className="text-white/30 text-[10px] truncate mt-0.5">{email}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 mt-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
              <span className="text-[9.5px] font-semibold uppercase tracking-[0.13em] text-white/20">
                Admin Portal
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="mx-4 h-px bg-white/5.5" />

          {/* Navigation */}
          <AdminNav />

          {/* Divider */}
          <div className="mx-4 h-px bg-white/5.5" />

          {/* Back to Store + Theme toggle */}
          <div className="px-4 py-3 flex items-center gap-1">
            <Link
              href="/"
              className="
                group flex items-center gap-2 px-3 py-2 rounded-lg flex-1
                text-[12px] font-medium text-white/35
                hover:text-white/75 hover:bg-white/5.5
                transition-all duration-150
              "
            >
              <ArrowLeft
                size={13}
                className="shrink-0 transition-transform duration-150 group-hover:-translate-x-0.5"
              />
              <span>Back to Store</span>
              <ExternalLink
                size={10}
                className="ml-auto shrink-0 opacity-0 group-hover:opacity-50 transition-opacity duration-150"
              />
            </Link>
            <AdminThemeToggle />
          </div>

        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 overflow-y-auto admin-main">
          <div className="p-8">
            {children}
          </div>
        </main>

      </div>
    </AdminThemeProvider>
  )
}
