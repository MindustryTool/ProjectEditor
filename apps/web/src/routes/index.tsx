import { createFileRoute, Link } from "@tanstack/react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  Package,
  FileCode2,
  Image,
  Languages,
  FileJson,
  FolderOpen,
  FileArchive,
  Clock,
  HardDrive,
  GitFork,
  TreePine,
  Share2,
  WifiOff,
  Database,
  Server,
  Box,
  FileType,
  Palette,
} from "lucide-react";

export const Route = createFileRoute("/")({ component: HomePage });

const features = [
  {
    title: "Mod Editing",
    icon: Package,
    color: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-500/10",
    items: [
      { label: "Edit mod metadata", icon: FileType },
      { label: "Edit content definitions", icon: FileCode2 },
      { label: "Manage assets", icon: Image },
      { label: "Localization editor", icon: Languages },
      { label: "JSON / HJSON editing", icon: FileJson },
    ],
  },
  {
    title: "File System",
    icon: FolderOpen,
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-500/10",
    items: [
      { label: "Open / save local folders", icon: FolderOpen },
      { label: "Import / export ZIPs", icon: FileArchive },
      { label: "Autosave support", icon: Clock },
      { label: "Persistent local workspace", icon: HardDrive },
    ],
  },
  {
    title: "Visual Editors",
    icon: GitFork,
    color: "from-violet-500 to-purple-500",
    bg: "bg-violet-500/10",
    items: [
      { label: "Logic graph editor", icon: GitFork },
      { label: "Tech tree editor", icon: TreePine },
      { label: "Content graph tools", icon: Share2 },
    ],
  },
  {
    title: "Offline First",
    icon: WifiOff,
    color: "from-amber-500 to-orange-500",
    bg: "bg-amber-500/10",
    items: [
      { label: "Installable PWA", icon: Box },
      { label: "Local caching", icon: Database },
      { label: "No server dependency", icon: Server },
    ],
  },
];

const iconMap: Record<string, typeof Palette> = {
  Package, FileCode2, Image, Languages, FileJson,
  FolderOpen, FileArchive, Clock, HardDrive,
  GitFork, TreePine, Share2,
  WifiOff, Database, Server, Box, FileType, Palette,
};

function HomePage() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <Hero />
      {features.map((group, i) => (
        <FeatureGroup key={group.title} group={group} index={i} />
      ))}
      <CTA />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-8 pt-14 sm:pb-12 sm:pt-20">
      <div className="hero-glow h-72 w-72 bg-emerald-500/20 -left-16 -top-16" />
      <div className="hero-glow h-96 w-96 bg-teal-500/15 right-0 top-1/3" />

      <div className="page-wrap relative">
        <div className="max-w-3xl">
          <p className="island-kicker mb-4 fade-in-up" style={{ animationDelay: "0ms" }}>
            Mindustry Mod Development Environment
          </p>

          <h1 className="display-title mb-6 text-5xl leading-[1.02] font-bold tracking-tight text-foreground sm:text-7xl fade-in-up" style={{ animationDelay: "80ms" }}>
            Project
            <br />
            <span className="bg-linear-to-r from-accent to-accent bg-clip-text text-transparent">
              Editor
            </span>
          </h1>

          <p className="mb-10 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg fade-in-up" style={{ animationDelay: "160ms" }}>
            A full-featured offline editor for Mindustry mods. Edit metadata, manage
            assets, build logic graphs, and pack your mod — all from your browser,
            no server required.
          </p>

          <div className="flex flex-wrap gap-3 fade-in-up" style={{ animationDelay: "240ms" }}>
            <Link to="/" className="btn-primary">
              <Package className="h-4 w-4" />
              New Project
            </Link>
            <button className="btn-secondary">
              <FolderOpen className="h-4 w-4" />
              Open Folder
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureGroup({ group, index }: { group: typeof features[number]; index: number }) {
  const Icon = group.icon;

  return (
    <section className="px-4 py-12 sm:py-16">
      {index > 0 && <hr className="section-divider page-wrap mb-12 sm:mb-16" />}

      <div className="page-wrap">
        <div className="mb-8 flex items-center gap-3 fade-in-up" style={{ animationDelay: "0ms" }}>
          <div className={`feature-icon bg-linear-to-br ${group.color}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="display-title text-2xl font-bold text-foreground sm:text-3xl">
              {group.title}
            </h2>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {group.items.map((item, i) => {
            const ItemIcon = iconMap[item.icon.name as string] ?? item.icon;
            return (
              <div
                key={item.label}
                className="feature-card-alt group rounded-xl px-5 py-4 fade-in-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className={`rounded-lg p-2 ${group.bg} text-foreground`}>
                    <ItemIcon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="m-0 text-sm font-semibold text-foreground">
                      {item.label}
                    </h3>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="px-4 py-16 sm:py-20">
      <hr className="section-divider page-wrap mb-12 sm:mb-16" />

      <div className="page-wrap">
        <div className="island-shell relative overflow-hidden rounded-4xl px-8 py-12 text-center sm:px-16 sm:py-16">
          <div className="hero-glow h-64 w-64 bg-emerald-500/15 -right-20 -top-20" />
          <div className="hero-glow h-64 w-64 bg-teal-500/10 -left-20 -bottom-20" />

          <div className="relative">
            <p className="island-kicker mb-3">Ready to build?</p>
            <h2 className="display-title mb-5 text-3xl font-bold text-foreground sm:text-4xl">
              Start editing your mod
            </h2>
            <p className="mb-8 text-muted-foreground">
              No sign-up, no server, no fuss. Everything runs locally in your browser.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button className="btn-primary">
                <Package className="h-4 w-4" />
                New Project
              </button>
              <button className="btn-secondary">
                <FolderOpen className="h-4 w-4" />
                Open Existing
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
