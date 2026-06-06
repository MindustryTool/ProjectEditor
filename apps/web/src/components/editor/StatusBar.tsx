import type { ReactNode } from "react"
import { cn } from "~/lib/utils"

interface StatusBarProps {
  left?: ReactNode
  center?: ReactNode
  right?: ReactNode
  className?: string
}

export function StatusBar({ left, center, right, className }: StatusBarProps) {
  return (
    <div
      className={cn(
        "flex h-6 min-h-6 max-h-6 items-center justify-between border-t bg-card px-3 text-xs text-muted-foreground",
        className
      )}
    >
      <div className="flex items-center gap-3">{left}</div>
      <div className="flex items-center gap-3">{center}</div>
      <div className="flex items-center gap-3">{right}</div>
    </div>
  )
}
