import { adminGuard } from '@/lib/security/admin-guard'
import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

const ALLOWED_STATUSES = new Set([
  'pending', 'confirmed', 'cod_upfront_paid', 'processing',
  'shipped', 'delivered', 'cancelled', 'refunded',
])

export async function PATCH(req: NextRequest) {
  const guard = await adminGuard(req)
  if (guard instanceof NextResponse) return guard
  const { admin } = guard

  const body = await req.json()
  const { ids, status } = body

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: 'ids must be a non-empty array' }, { status: 400 })
  }
  if (!ALLOWED_STATUSES.has(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }
  if (ids.length > 100) {
    return NextResponse.json({ error: 'Cannot update more than 100 orders at once' }, { status: 400 })
  }

  const { error, count } = await admin
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .in('id', ids)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  revalidateTag('orders')
  revalidateTag('admin-orders')
  revalidateTag('admin-dashboard')
  revalidateTag('admin-delivery')

  return NextResponse.json({ updated: count ?? ids.length })
}
