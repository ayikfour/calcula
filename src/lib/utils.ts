import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// True when running as an installed PWA (standalone display mode on
// Android/desktop, or the iOS-specific `navigator.standalone` flag on
// Safari home-screen apps). Email links always open in the OS default
// browser rather than an installed PWA, so callers use this to steer
// standalone users toward the OTP-code sign-in path instead.
export function isStandalonePwa() {
  if (typeof window === 'undefined') return false
  const nav = navigator as Navigator & { standalone?: boolean }
  return window.matchMedia('(display-mode: standalone)').matches || nav.standalone === true
}
