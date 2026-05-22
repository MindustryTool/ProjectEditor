import { Package } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="site-footer px-4 pb-14 pt-10 text-[var(--sea-ink-soft)]">
      <div className="page-wrap flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-[var(--lagoon)]" />
          <p className="m-0 text-sm">
            Project Editor &mdash; Mindustry Mod Editor
          </p>
        </div>
        <p className="island-kicker m-0">
          Fully offline &middot; No server &middot; PWA ready
        </p>
      </div>
    </footer>
  )
}
