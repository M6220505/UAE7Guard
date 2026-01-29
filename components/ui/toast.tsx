"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ToastProps {
  title: string
  description?: string
  variant?: "default" | "destructive"
  open: boolean
  onClose: () => void
}

export function Toast({ title, description, variant = "default", open, onClose }: ToastProps) {
  React.useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 p-4 shadow-lg animate-in slide-in-from-top-full duration-300",
        variant === "destructive" ? "bg-red-900/95 text-white" : "bg-card text-card-foreground"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="font-semibold">{title}</p>
          {description && <p className="text-sm opacity-90 mt-1">{description}</p>}
        </div>
        <button onClick={onClose} className="opacity-70 hover:opacity-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  )
}
