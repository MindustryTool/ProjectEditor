import { createFileRoute, redirect } from "@tanstack/react-router"
import { getDetectedLocale } from "../lib/locales"

export const Route = createFileRoute("/$")({
  beforeLoad: ({ location }) => {
    const detected = getDetectedLocale()
    throw redirect({
      href: `/${detected}${location.pathname}`,
      replace: true,
    })
  },
  component: () => null,
})
