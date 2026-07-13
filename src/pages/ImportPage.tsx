import { useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import { parse as parseCsv } from 'papaparse'
import { parse as parseDate, isValid as isValidDate } from 'date-fns'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Check, UploadSimple } from '@phosphor-icons/react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useCategories } from '../hooks/useCategories'
import { useSpaceMembers } from '../hooks/useSpaceMembers'
import { getCurrency, parseCurrencyAmount } from '../lib/currencies'
import { formatCurrency, formatDateLabel } from '../lib/format'
import { toISODateLocal } from '../lib/dates'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'

const REQUIRED_HEADERS = ['category', 'amount', 'paid by', 'description', 'date'] as const
type RequiredHeader = (typeof REQUIRED_HEADERS)[number]
const CHUNK_SIZE = 500

interface RawRow {
  category: string
  amount: string
  'paid by': string
  description: string
  date: string
}

// Header matching is tolerant of casing/whitespace and a handful of common
// aliases, so a file doesn't get rejected outright over a trivial rename
// (e.g. a spreadsheet exported with "Payer" or "Notes" instead of the exact
// column names below).
const HEADER_ALIASES: Record<string, RequiredHeader> = {
  category: 'category',
  amount: 'amount',
  price: 'amount',
  cost: 'amount',
  'paid by': 'paid by',
  paidby: 'paid by',
  payer: 'paid by',
  'who paid': 'paid by',
  description: 'description',
  notes: 'description',
  note: 'description',
  merchant: 'description',
  date: 'date',
}

function normalizeHeader(h: string): string {
  return h.trim().toLowerCase().replace(/\s+/g, ' ')
}

interface ParsedRow {
  raw: RawRow
  amount: number | null
  category: string | null
  expense_date: string | null
  paid_by: string | null
  paid_by_label: string | null
  description: string
  errors: string[]
  manuallyExcluded: boolean
  isDuplicate: boolean
}

type Step = 'upload' | 'configure' | 'preview' | 'done'

// The sheet's category/payer dropdowns render as an emoji + name (e.g.
// "🍖 Food", "🥷 Blanche"), which the CSV export preserves literally.
// Strip everything before the first Latin letter so matching/display works
// against plain category and display names.
function cleanName(raw: string): string {
  const match = raw.match(/[A-Za-z].*/)
  return (match ? match[0] : raw).trim()
}

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/
function isIsoDate(value: string): boolean {
  return ISO_DATE_RE.test(value)
}

// Sheet dates have no year ("Thursday, June 25") — the "date" candidate
// pulls the year from the year picked in the configure step. The others
// cover full dates in case a future export includes one.
function parseImportDate(raw: string, year: number): string | null {
  const trimmed = raw.trim()
  const candidates: { format: string; ref: Date }[] = [
    { format: 'EEEE, MMMM d', ref: new Date(year, 0, 1) },
    { format: 'MMMM d, yyyy', ref: new Date() },
    { format: 'yyyy-MM-dd', ref: new Date() },
    { format: 'M/d/yyyy', ref: new Date() },
  ]
  for (const { format, ref } of candidates) {
    const parsed = parseDate(trimmed, format, ref)
    if (isValidDate(parsed)) return toISODateLocal(parsed)
  }
  return null
}

// A row "looks like" a duplicate if every user-visible field matches —
// used both against what's already in the database and against earlier
// rows in the same file, so re-importing a file (or a file with repeated
// rows) doesn't silently double expenses.
function dupKey(row: {
  expense_date: string
  amount: number
  category: string
  description: string
  paid_by: string | null
  paid_by_label: string | null
}): string {
  const payerKey = row.paid_by ?? `label:${(row.paid_by_label ?? '').toLowerCase()}`
  return [
    row.expense_date,
    row.amount.toFixed(2),
    row.category.toLowerCase(),
    row.description.trim().toLowerCase(),
    payerKey,
  ].join('|')
}

export function ImportPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const fromOnboarding = location.state?.from === 'onboarding'
  const { user, space } = useAuth()
  const [categories] = useCategories()
  const members = useSpaceMembers(space?.space_id)
  const currency = getCurrency(space?.currency_code ?? 'IDR')

  const [step, setStep] = useState<Step>('upload')
  const [rawRows, setRawRows] = useState<RawRow[]>([])
  const [parseError, setParseError] = useState('')
  const [year, setYear] = useState(new Date().getFullYear())
  const [selfName, setSelfName] = useState('')
  const [rows, setRows] = useState<ParsedRow[]>([])
  const [checking, setChecking] = useState(false)
  const [committing, setCommitting] = useState(false)
  const [imported, setImported] = useState(0)

  const distinctPayers = useMemo(
    () => Array.from(new Set(rawRows.map(r => cleanName(r['paid by'] ?? '')).filter(Boolean))),
    [rawRows]
  )
  const tooManyPayers = distinctPayers.length > 2

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setParseError('')
    parseCsv<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: results => {
        const fields = results.meta.fields ?? []
        const headerMap = new Map<RequiredHeader, string>()
        for (const field of fields) {
          const canonical = HEADER_ALIASES[normalizeHeader(field)]
          if (canonical && !headerMap.has(canonical)) headerMap.set(canonical, field)
        }
        const missing = REQUIRED_HEADERS.filter(h => !headerMap.has(h))
        if (missing.length > 0) {
          setParseError(
            `This file is missing expected column(s): ${missing.join(', ')}. Expected: ${REQUIRED_HEADERS.join(', ')}.`
          )
          return
        }
        if (results.data.length === 0) {
          setParseError('No rows found in this file.')
          return
        }
        const normalizedRows: RawRow[] = results.data.map(raw => ({
          category: raw[headerMap.get('category')!] ?? '',
          amount: raw[headerMap.get('amount')!] ?? '',
          'paid by': raw[headerMap.get('paid by')!] ?? '',
          description: raw[headerMap.get('description')!] ?? '',
          date: raw[headerMap.get('date')!] ?? '',
        }))
        setRawRows(normalizedRows)
        setStep('configure')
      },
      error: err => setParseError(err.message),
    })
  }

  async function handleConfigure() {
    if (!selfName || tooManyPayers || !space) return
    setChecking(true)

    const otherRaw = distinctPayers.find(p => p.toLowerCase() !== selfName.toLowerCase()) ?? null
    const otherMember = otherRaw
      ? members.find(m => m.user_id !== user?.id && m.display_name.toLowerCase() === otherRaw.toLowerCase())
      : undefined

    const built: ParsedRow[] = rawRows.map(raw => {
      const payerRaw = cleanName(raw['paid by'] ?? '')
      let paid_by: string | null = null
      let paid_by_label: string | null = null
      if (payerRaw.toLowerCase() === selfName.toLowerCase()) {
        paid_by = user!.id
      } else if (otherMember) {
        paid_by = otherMember.user_id
      } else {
        paid_by_label = payerRaw || null
      }

      const amount = parseCurrencyAmount(raw.amount ?? '', currency)
      const categoryMatch = categories.find(
        c => c.name.toLowerCase() === cleanName(raw.category ?? '').toLowerCase()
      )
      const expense_date = parseImportDate(raw.date ?? '', year)

      const errors: string[] = []
      if (!amount) errors.push('invalid amount')
      if (!categoryMatch) errors.push('unknown category')
      if (!expense_date) errors.push('unparseable date')
      if (!payerRaw) errors.push('missing paid by')

      return {
        raw,
        amount,
        category: categoryMatch?.name ?? null,
        expense_date,
        paid_by,
        paid_by_label,
        description: (raw.description ?? '').trim(),
        errors,
        manuallyExcluded: false,
        isDuplicate: false,
      }
    })

    // Seed the dedup set with expenses already in the database for the
    // dates this file touches, then walk the file in order so repeated
    // rows within the same file also get flagged (each row's key is added
    // right after it's checked).
    const distinctDates = Array.from(
      new Set(built.filter(r => r.errors.length === 0).map(r => r.expense_date!))
    )
    const seenKeys = new Set<string>()
    if (distinctDates.length > 0) {
      const { data: existing } = await supabase
        .from('expenses')
        .select('expense_date, amount, category, description, paid_by, paid_by_label')
        .in('expense_date', distinctDates)
      for (const row of existing ?? []) {
        seenKeys.add(
          dupKey({
            expense_date: row.expense_date,
            amount: Number(row.amount),
            category: row.category,
            description: row.description,
            paid_by: row.paid_by,
            paid_by_label: row.paid_by_label,
          })
        )
      }
    }

    for (const row of built) {
      if (row.errors.length > 0) continue
      const key = dupKey({
        expense_date: row.expense_date!,
        amount: row.amount!,
        category: row.category!,
        description: row.description,
        paid_by: row.paid_by,
        paid_by_label: row.paid_by_label,
      })
      if (seenKeys.has(key)) {
        row.isDuplicate = true
        row.manuallyExcluded = true
      }
      seenKeys.add(key)
    }

    setRows(built)
    setChecking(false)
    setStep('preview')
  }

  function fixRowCategory(index: number, categoryName: string) {
    setRows(prev =>
      prev.map((r, i) =>
        i === index ? { ...r, category: categoryName, errors: r.errors.filter(e => e !== 'unknown category') } : r
      )
    )
  }

  // A row lands here (paid_by null, paid_by_label set) whenever the CSV's
  // "paid by" name didn't match the importer or an already-joined member —
  // e.g. the partner hasn't joined yet, or joined under a different display
  // name than the one typed into the spreadsheet. Lets the importer
  // reassign it by hand instead of it silently riding along as "Partner"
  // until (or unless) a name-based join-time backfill happens to catch it.
  function fixRowPayer(index: number, payerId: string) {
    setRows(prev => prev.map((r, i) => (i === index ? { ...r, paid_by: payerId, paid_by_label: null } : r)))
  }

  function toggleManualExclude(index: number) {
    setRows(prev => prev.map((r, i) => (i === index ? { ...r, manuallyExcluded: !r.manuallyExcluded } : r)))
  }

  const readyRows = rows.filter(r => r.errors.length === 0 && !r.manuallyExcluded)
  const readyTotal = readyRows.reduce((s, r) => s + (r.amount ?? 0), 0)

  // Grouped the same way the Log screen groups its list — one header per
  // date with a running total, rows underneath — so reviewing an import
  // feels like reviewing the log it's about to join. Rows with a date that
  // failed to parse are bucketed under their raw literal text instead.
  const groupedRows = useMemo(() => {
    const map = new Map<string, { row: ParsedRow; index: number }[]>()
    rows.forEach((row, index) => {
      const key = row.expense_date ?? row.raw.date
      const list = map.get(key) ?? []
      list.push({ row, index })
      map.set(key, list)
    })
    return Array.from(map.entries())
  }, [rows])

  async function handleCommit() {
    if (!space || readyRows.length === 0) return
    setCommitting(true)

    for (let i = 0; i < readyRows.length; i += CHUNK_SIZE) {
      const chunk = readyRows.slice(i, i + CHUNK_SIZE).map(r => ({
        paid_by: r.paid_by,
        paid_by_label: r.paid_by_label,
        logged_by: user!.id,
        amount: r.amount,
        category: r.category,
        description: r.description,
        expense_date: r.expense_date,
        recurring_expense_id: null,
      }))
      const { error } = await supabase.from('expenses').insert(chunk)
      if (error) {
        toast(`Import failed: ${error.message}`)
        setCommitting(false)
        return
      }
    }

    setImported(readyRows.length)
    setCommitting(false)
    setStep('done')
    toast(`Imported ${readyRows.length} expense${readyRows.length === 1 ? '' : 's'}`)
  }

  return (
    <div className="space-y-5 p-6">
      <div>
        <h1 className="font-heading text-xl font-medium text-foreground">Import expenses</h1>
        <p className="text-sm text-muted-foreground">Load expenses from a CSV export of your spreadsheet.</p>
      </div>

      {step === 'upload' && (
        <Card className="space-y-3 p-5">
          <p className="text-sm text-muted-foreground">
            Expects columns:{' '}
            <span className="font-medium text-foreground">category, amount, paid by, description, date</span>.
          </p>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border px-4 py-10 text-center transition-colors hover:bg-muted">
            <UploadSimple className="size-6 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Choose a CSV file</span>
            <input type="file" accept=".csv,text/csv" className="hidden" onChange={handleFile} />
          </label>
          {parseError && <p className="text-sm text-destructive">{parseError}</p>}
        </Card>
      )}

      {step === 'configure' && (
        <Card className="space-y-5 p-5">
          <div className="space-y-2">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Year</p>
            <p className="text-sm text-muted-foreground">
              Dates like "Thursday, June 25" don't include a year — which year is this file from?
            </p>
            <Input
              type="number"
              value={year}
              onChange={e => setYear(Number(e.target.value))}
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Which name is you?</p>
            <div className="overflow-hidden rounded-lg border border-border">
              {distinctPayers.map(name => {
                const selected = selfName === name
                return (
                  <button
                    key={name}
                    onClick={() => setSelfName(name)}
                    className="flex w-full items-center justify-between border-b border-border px-4 py-3.5 text-left text-sm font-medium text-foreground last:border-b-0"
                  >
                    {name}
                    {selected && <Check className="size-4" weight="bold" />}
                  </button>
                )
              })}
            </div>
            {tooManyPayers && (
              <p className="text-sm text-destructive">
                This file has more than 2 different "paid by" names — a space can only have 2 members. Fix the
                file and re-upload.
              </p>
            )}
          </div>

          <Button onClick={handleConfigure} disabled={!selfName || tooManyPayers || checking} className="w-full">
            {checking ? 'Checking for duplicates…' : 'Continue'}
          </Button>
        </Card>
      )}

      {step === 'preview' && (
        <div className="space-y-4">
          <Card className="space-y-1.5 p-5">
            <p className="text-sm text-foreground">
              <span className="font-medium">{readyRows.length}</span> ready to import
              {rows.length - readyRows.length > 0 && (
                <span className="text-muted-foreground"> · {rows.length - readyRows.length} skipped</span>
              )}
            </p>
            <p className="font-heading text-lg font-medium text-foreground">
              {formatCurrency(readyTotal, space?.currency_code)}
            </p>
            <p className="text-xs text-muted-foreground">
              Possible duplicates are unchecked by default — review before importing.
            </p>
          </Card>

          <div>
            {groupedRows.map(([dateKey, items]) => {
              const dayTotal = items.reduce((s, { row }) => s + (row.amount ?? 0), 0)
              const label = isIsoDate(dateKey) ? formatDateLabel(dateKey) : dateKey

              return (
                <div key={dateKey}>
                  <div className="flex items-baseline justify-between px-5 pt-3 pb-1.5">
                    <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      {label}
                    </span>
                    <span className="font-heading text-xs text-muted-foreground">
                      {formatCurrency(dayTotal, space?.currency_code)}
                    </span>
                  </div>

                  <div className="mb-1">
                    {items.map(({ row, index }, i) => {
                      const excluded = row.errors.length > 0 || row.manuallyExcluded
                      const payerLabel = row.paid_by === user?.id ? 'You' : 'Partner'
                      const categoryMeta = categories.find(c => c.name === row.category)
                      const includable = row.errors.length === 0

                      return (
                        <div
                          key={index}
                          role="button"
                          tabIndex={0}
                          onClick={() => { if (includable) toggleManualExclude(index) }}
                          onKeyDown={e => {
                            if (includable && (e.key === 'Enter' || e.key === ' ')) {
                              e.preventDefault()
                              toggleManualExclude(index)
                            }
                          }}
                          className={`flex w-full items-center gap-3 border-b border-border bg-background px-5 py-3.5 text-left ${includable ? 'cursor-pointer' : ''} ${excluded ? 'opacity-50' : ''}`}
                          style={i === 0 ? { borderTop: '1px solid var(--border)' } : undefined}
                        >
                          <Checkbox checked={!excluded} className="pointer-events-none shrink-0" tabIndex={-1} />

                          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-lg">
                            {categoryMeta?.icon ?? '❓'}
                          </div>

                          <div className="min-w-0 flex-1">
                            {row.category ? (
                              <p className="mb-0.5 truncate text-base font-medium text-foreground">
                                {row.category}
                              </p>
                            ) : (
                              <select
                                value=""
                                onClick={e => e.stopPropagation()}
                                onChange={e => fixRowCategory(index, e.target.value)}
                                className="mb-0.5 rounded border border-border bg-input/30 px-1.5 py-0.5 text-xs text-foreground"
                              >
                                <option value="" disabled>
                                  Fix category…
                                </option>
                                {categories.map(c => (
                                  <option key={c.id} value={c.name}>
                                    {c.icon} {c.name}
                                  </option>
                                ))}
                              </select>
                            )}
                            <div className="flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
                              {row.description && <span className="truncate">{row.description}</span>}
                              {row.description && <span>·</span>}
                              {row.paid_by === null ? (
                                <select
                                  value=""
                                  onClick={e => e.stopPropagation()}
                                  onChange={e => fixRowPayer(index, e.target.value)}
                                  className="shrink-0 rounded border border-border bg-input/30 px-1.5 py-0.5 text-xs text-foreground"
                                >
                                  <option value="" disabled>
                                    Fix payer…
                                  </option>
                                  <option value={user!.id}>You</option>
                                  {members
                                    .filter(m => m.user_id !== user?.id)
                                    .map(m => (
                                      <option key={m.user_id} value={m.user_id}>
                                        {m.display_name}
                                      </option>
                                    ))}
                                </select>
                              ) : (
                                <span className="truncate">{payerLabel}</span>
                              )}
                            </div>
                            {row.errors.length > 0 && (
                              <p className="truncate text-xs text-destructive">{row.errors.join(', ')}</p>
                            )}
                            {row.errors.length === 0 && row.isDuplicate && (
                              <p className="truncate text-xs text-muted-foreground">
                                Possible duplicate — already in your log
                              </p>
                            )}
                          </div>

                          <span className="font-heading shrink-0 text-base font-medium text-foreground">
                            {row.amount ? formatCurrency(row.amount, space?.currency_code) : row.raw.amount}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={() => setStep('configure')}>
              Back
            </Button>
            <Button className="flex-1" onClick={handleCommit} disabled={committing || readyRows.length === 0}>
              {committing ? 'Importing…' : `Import ${readyRows.length} expense${readyRows.length === 1 ? '' : 's'}`}
            </Button>
          </div>
        </div>
      )}

      {step === 'done' && (
        <Card className="space-y-3 p-5 text-center">
          <p className="text-base font-medium text-foreground">
            Imported {imported} expense{imported === 1 ? '' : 's'}
          </p>
          <Button onClick={() => navigate(fromOnboarding ? '/onboarding?step=invite' : '/log')} className="w-full">
            {fromOnboarding ? 'Continue' : 'Back to log'}
          </Button>
        </Card>
      )}
    </div>
  )
}
