import { createFileRoute, redirect } from "@tanstack/react-router"
import { EditorPage } from "../../components/editor"
import { isSupportedLocale, setLocale } from "../../lib/locales"

export const Route = createFileRoute("/$lang/editor")({
  beforeLoad: ({ params }) => {
    if (!isSupportedLocale(params.lang)) {
      throw redirect({ href: "/en/editor", replace: true })
    }
    setLocale(params.lang)
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <EditorPage />
}
