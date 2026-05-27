import { createFileRoute, redirect, useNavigate, useParams } from "@tanstack/react-router"
import { ProjectsPage } from "../../../components/editor/ProjectsPage"
import { isSupportedLocale, setLocale } from "../../../lib/locales"

export const Route = createFileRoute("/$lang/projects/")({
  beforeLoad: ({ params }) => {
    if (!isSupportedLocale(params.lang)) {
      throw redirect({ href: "/en/projects", replace: true })
    }
    setLocale(params.lang)
  },
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { lang } = useParams({ from: "/$lang/projects/" })

  return (
    <ProjectsPage
      onProjectSelected={(id) => {
        navigate({ to: `/${lang}/projects/${id}`, replace: true })
      }}
    />
  )
}
