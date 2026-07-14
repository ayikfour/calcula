import { forwardRef } from 'react'
import { InsightTicket } from './InsightTicket'
import type { Insight } from '../lib/spendingInsights'

interface Props {
  insight: Insight
  monthLabel: string
  /** Shows raw currency amounts instead of the default relative framing — must match the sheet's preview toggle so the captured PNG matches what's shown. */
  revealed?: boolean
}

// Rendered off-screen at a fixed 1080x1920 (9:16, Stories-native) pixel
// size — real layout/paint, just positioned outside the viewport, so the
// capture is 1:1 with the target resolution instead of upsampling a
// smaller node (which would blur the barcode/thin borders).
export const InsightExportCard = forwardRef<HTMLDivElement, Props>(function InsightExportCard({ insight, monthLabel, revealed = false }, ref) {
  return (
    <div ref={ref} className="fixed top-0 left-[-9999px]" aria-hidden>
      <InsightTicket insight={insight} size="export" monthLabel={monthLabel} revealed={revealed} />
    </div>
  )
})
