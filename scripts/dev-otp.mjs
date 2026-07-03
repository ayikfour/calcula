// Dev-only helper: generates a real OTP for a test email via the Supabase
// admin API, without sending or waiting on any email. Useful for testing
// the auth flow somewhere a magic-link redirect can't land (e.g. the Claude
// Code preview pane, a separate browser context from your inbox).
//
// Usage:
//   node --env-file=.env scripts/dev-otp.mjs you@example.com [magiclink|signup|recovery]
//
// Type defaults to magiclink (email-code sign-in). Use `signup` to verify
// a fresh password-account confirmation, `recovery` for the forgot-password
// flow. Each type is a separate Supabase-internal token — generating a
// `recovery` code does not invalidate an earlier `magiclink` one for the
// same email, but generating a second code of the *same* type does
// invalidate the first — run this again if you already triggered that flow
// in the app after your last run.
//
// Note: `signup` requires the email NOT already be a confirmed user —
// Supabase errors ("User already registered") if you re-run it for an
// account that already completed signup confirmation. Use a fresh email,
// or `recovery`/`magiclink` to test sign-in on an existing account.
//
// Requires SUPABASE_SERVICE_ROLE_KEY in .env (never used by the app itself,
// never bundled into client code — see the comment above it in .env).

import { createClient } from '@supabase/supabase-js'

const email = process.argv[2]
const type = process.argv[3] ?? 'magiclink'
const validTypes = ['magiclink', 'signup', 'recovery']

if (!email || !validTypes.includes(type)) {
  console.error('Usage: node --env-file=.env scripts/dev-otp.mjs <email> [magiclink|signup|recovery]')
  process.exit(1)
}

const url = process.env.VITE_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.')
  console.error('Add SUPABASE_SERVICE_ROLE_KEY to .env (see comment there for where to get it),')
  console.error('then run with: node --env-file=.env scripts/dev-otp.mjs <email>')
  process.exit(1)
}

const supabase = createClient(url, serviceKey)

// `signup` links are generated the same way signUp() creates them, so the
// admin API needs a password — reuses whatever the account was created
// with if it already exists unconfirmed (doesn't overwrite it), only
// matters for genuinely new emails.
const options = { type, email }
if (type === 'signup') options.password = process.argv[4] ?? 'dev-otp-testing'

const { data, error } = await supabase.auth.admin.generateLink(options)

if (error) {
  console.error('Failed to generate OTP:', error.message)
  process.exit(1)
}

console.log(`Email:    ${email}`)
console.log(`Type:     ${type}`)
console.log(`OTP code: ${data.properties?.email_otp}`)
console.log('\nEnter this in the "or enter the code" field on the auth screen.')
console.log('Note: generating a new code invalidates any earlier one of the *same type* for the')
console.log('same email — run this again if you already triggered that flow in the app since.')
