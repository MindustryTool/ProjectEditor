import { createFileRoute, redirect } from "@tanstack/react-router"
import { EditorPage } from "#/components/editor"
import { isSupportedLocale, setLocale } from "#/lib/locales"

export const Route = createFileRoute("/$lang/projects/$id")({
  beforeLoad: ({ params }) => {
    if (!isSupportedLocale(params.lang)) {
      throw redirect({ href: "/en/projects", replace: true })
    }
    setLocale(params.lang)
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <EditorPage />
}
