import * as React from "react"

import { cn } from "~/lib/utils"
import { Label } from "./label"

function FormField({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div data-slot="form-field" className={cn("space-y-2", className)} {...props} />
}

function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return <Label data-slot="form-label" className={cn("", className)} {...props} />
}

function FormControl({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="form-control"
      className={cn("[&>input]:w-full [&>select]:w-full", className)}
      {...props}
    />
  )
}

function FormDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="form-description"
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

function FormMessage({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="form-message"
      className={cn("text-xs text-destructive", className)}
      {...props}
    />
  )
}

export { FormField, FormLabel, FormControl, FormDescription, FormMessage }
