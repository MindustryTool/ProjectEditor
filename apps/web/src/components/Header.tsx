import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import ThemeToggle from "./ThemeToggle";
import { LocalePicker } from "./LocalePicker";
import { Package } from "lucide-react";
import i18n from "#/i18n/i18n";

const lang = () => (i18n.language?.startsWith("vi") ? "vi" : "en");

export default function Header() {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 border-b border-(--line) bg-(--header-bg) px-4 backdrop-blur-lg">
      <nav className="page-wrap flex flex-wrap items-center gap-x-3 gap-y-2 py-3 sm:py-4">
        <h2 className="m-0 shrink-0 text-base font-semibold tracking-tight">
          <Link
            to="/$lang"
            params={{ lang: lang() }}
            className="inline-flex items-center gap-2 rounded-full border border-(--chip-line) bg-(--chip-bg) px-3 py-1.5 text-sm text-foreground no-underline shadow-[0_8px_24px_rgba(30,90,72,0.08)] sm:px-4 sm:py-2"
          >
            <Package className="h-4 w-4 text-(--lagoon)" />
            {t("app.title")}
          </Link>
        </h2>

        <div className="order-3 flex w-full flex-wrap items-center gap-x-4 gap-y-1 pb-1 text-sm font-semibold sm:order-0 sm:w-auto sm:flex-nowrap sm:pb-0">
          <Link
            to="/$lang"
            params={{ lang: lang() }}
            className="nav-link"
            activeProps={{ className: "nav-link is-active" }}
          >
            {t("nav.home")}
          </Link>
          <Link
            to="/$lang/about"
            params={{ lang: lang() }}
            className="nav-link"
            activeProps={{ className: "nav-link is-active" }}
          >
            {t("nav.about")}
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <LocalePicker />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
