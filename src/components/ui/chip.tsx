"use client"

import * as React from "react"
import { Toggle as TogglePrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Chip({
  className,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root>) {
  return (
    <TogglePrimitive.Root
      data-slot="chip"
      className={cn(
        "inline-flex h-8 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-transparent px-3.5 text-xs font-medium text-muted-foreground transition-colors outline-none hover:bg-muted disabled:pointer-events-none disabled:opacity-50 data-[state=on]:border-transparent data-[state=on]:bg-secondary data-[state=on]:text-secondary-foreground",
        className
      )}
      {...props}
    />
  )
}

export { Chip }
