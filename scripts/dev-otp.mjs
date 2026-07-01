// Dev-only helper: generates a real sign-in OTP for a test email via the
// Supabase admin API, without sending or waiting on any email. Useful for
// testing the auth flow somewhere a magic-link redirect can't land (e.g. the
// Claude Code preview pane, a separate browser context from your inbox).
//
// Usage:
//   node --env-file=.env scripts/dev-otp.mjs you@example.com
//
// Requires SUPABASE_SERVICE_ROLE_KEY in .env (never used by the app itself,
// never bundled into client code — see the comment above it in .env).

import { createClient } from '@supabase/supabase-js'

const email = process.argv[2]
if (!email) {
  console.error('Usage: node --env-file=.env scripts/dev-otp.mjs <email>')
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

const { data, error } = await supabase.auth.admin.generateLink({
  type: 'magiclink',
  email,
})

if (error) {
  console.error('Failed to generate OTP:', error.message)
  process.exit(1)
}

console.log(`Email:    ${email}`)
console.log(`OTP code: ${data.properties?.email_otp}`)
console.log('\nEnter this in the "or enter the code" field on the auth screen.')
console.log('Note: generating a new code invalidates any earlier one for the same email —')
console.log('run this again if you already clicked "Send magic link" in the app after your last run.')
