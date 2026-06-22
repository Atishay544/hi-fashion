import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendOtpEmail } from '@/lib/email'
import { rateLimit } from '@/lib/security/rate-limit'

export async function POST(req: NextRequest) {
  const limited = await rateLimit(req, 'otp')
  if (limited) return limited

  let email: string
  try {
    ;({ email } = await req.json())
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })

  const admin = createAdminClient()

  // generateLink with type 'email' creates the OTP in Supabase WITHOUT sending an email.
  // properties.email_otp contains the 6-digit code for verifyOtp() on the client.
  const { data, error } = await admin.auth.admin.generateLink({
    type: 'email',
    email: email.trim().toLowerCase(),
    options: { shouldCreateUser: true },
  })

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 })

  const otp = data?.properties?.email_otp
  if (!otp)
    return NextResponse.json({ error: 'Could not generate OTP. Please try again.' }, { status: 500 })

  try {
    await sendOtpEmail({ to: email.trim(), otp })
  } catch (e: any) {
    console.error('[email] OTP send failed:', e?.message)
    return NextResponse.json({ error: 'Failed to send email. Please try again.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
