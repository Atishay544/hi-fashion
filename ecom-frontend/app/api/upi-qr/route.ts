import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'
import { assertSameOrigin } from '@/lib/security/csrf'
import { rateLimit } from '@/lib/security/rate-limit'

const UPI_ID   = process.env.UPI_ID   ?? process.env.NEXT_PUBLIC_UPI_ID   ?? ''
const UPI_NAME = process.env.UPI_NAME ?? process.env.NEXT_PUBLIC_UPI_NAME ?? 'Hi Fashions'

// Maximum amount we will ever encode in a QR — sanity ceiling
const MAX_QR_AMOUNT = 100_000

export async function GET(req: NextRequest) {
  const csrf = assertSameOrigin(req)
  if (csrf) return csrf

  const limited = await rateLimit(req, 'default')
  if (limited) return limited

  const { searchParams } = new URL(req.url)
  const rawAmount = searchParams.get('amount')

  if (!rawAmount)
    return NextResponse.json({ error: 'amount required' }, { status: 400 })

  const amount = parseFloat(rawAmount)
  if (!isFinite(amount) || amount <= 0 || amount > MAX_QR_AMOUNT)
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })

  if (!UPI_ID)
    return NextResponse.json({ error: 'UPI not configured' }, { status: 503 })

  const upiLink = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(UPI_NAME)}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent('Hi Fashion Order')}`

  const dataUrl = await QRCode.toDataURL(upiLink, {
    errorCorrectionLevel: 'M',
    margin: 2,
    width: 220,
    color: { dark: '#000000', light: '#ffffff' },
  })

  // Strip the "data:image/png;base64," prefix — client reconstructs it
  const base64 = dataUrl.split(',')[1]
  const img    = Buffer.from(base64, 'base64')

  return new NextResponse(img, {
    headers: {
      'Content-Type':  'image/png',
      'Cache-Control': 'no-store',        // never cache — amount is order-specific
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
