import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendSignupConfirmation } from '@/lib/email'
import { rateLimit } from '@/lib/security/rate-limit'

export async function POST(req: NextRequest) {
  const limited = await rateLimit(req, 'otp')
  if (limited) return limited

  let email: string, password: string, fullName: string
  try {
    ;({ email, password, fullName } = await req.json())
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  if (!password || password.length < 6)
    return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })

  const admin = createAdminClient()

  // Create user without sending Supabase's confirmation email (email_confirm: false)
  const { data: newUser, error: createErr } = await admin.auth.admin.createUser({
    email: email.trim().toLowerCase(),
    password,
    email_confirm: false,
    user_metadata: { full_name: fullName?.trim() ?? '' },
  })

  // If user already exists, generate a fresh confirmation link instead
  let actionLink: string | undefined
  if (createErr?.message?.toLowerCase().includes('already registered') ||
      createErr?.message?.toLowerCase().includes('already been registered')) {
    return NextResponse.json({ error: 'An account with this email already exists. Please sign in.' }, { status: 409 })
  }
  if (createErr)
    return NextResponse.json({ error: createErr.message }, { status: 400 })

  // Generate the confirmation link without Supabase sending an email
  const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
    type: 'signup',
    email: email.trim().toLowerCase(),
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.hifashions.shop'}/auth/callback?next=/account`,
    },
  })

  if (linkErr || !linkData?.properties?.action_link)
    return NextResponse.json({ error: 'Failed to generate confirmation link. Please try again.' }, { status: 500 })

  actionLink = linkData.properties.action_link

  try {
    await sendSignupConfirmation({ to: email.trim(), name: fullName?.trim(), confirmLink: actionLink })
  } catch (e: any) {
    console.error('[email] signup confirmation send failed:', e?.message)
    return NextResponse.json({ error: 'Failed to send confirmation email. Please try again.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
