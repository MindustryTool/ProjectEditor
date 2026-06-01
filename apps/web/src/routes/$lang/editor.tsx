import { createFileRoute, redirect } from "@tanstack/react-router"
import { isSupportedLocale } from "#/lib/locales"

export const Route = createFileRoute("/$lang/editor")({
  beforeLoad: ({ params }) => {
    if (!isSupportedLocale(params.lang)) {
      throw redirect({ href: "/en/projects", replace: true })
    }
    throw redirect({ href: `/${params.lang}/projects`, replace: true })
  },
  component: () => null,
})
