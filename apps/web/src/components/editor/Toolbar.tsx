import type { ReactNode } from "react"
import { cn } from "~/lib/utils"

interface ToolbarProps {
  children: ReactNode
  className?: string
}

export function Toolbar({ children, className }: ToolbarProps) {
  return (
    <div
      className={cn(
        "flex h-9 items-center gap-1 border-b bg-muted px-2 text-sm",
        className
      )}
    >
      {children}
    </div>
  )
}
