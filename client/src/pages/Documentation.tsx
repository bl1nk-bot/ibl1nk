import { BookOpen, CheckCircle2, Terminal } from "lucide-react";
import { Link } from "wouter";

const steps = [
  "Create a workspace and name your project",
  "Add your first story outline",
  "Build characters and connect their relationships",
];

export default function Documentation() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-4xl space-y-8 px-4 py-8 sm:px-6 md:py-12">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="font-mono text-sm font-bold tracking-[0.25em]">
            BL<span className="text-emerald-400">1</span>NK
          </Link>
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
            Open workspace
          </Link>
        </header>
        <section className="space-y-3">
          <div className="flex items-center gap-3 text-emerald-500"><BookOpen className="h-6 w-6" /><span className="font-mono text-xs uppercase tracking-[0.2em]">Documentation</span></div>
          <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-5xl">Start building with BL1NK</h1>
          <p className="max-w-2xl text-pretty leading-6 text-muted-foreground">A practical guide to setting up your workspace, outlining a story, and shaping a cast.</p>
        </section>
        <section className="grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <article key={step} className="min-w-0 rounded-xl border bg-card p-5">
              <CheckCircle2 className="mb-5 h-5 w-5 text-emerald-500" />
              <p className="font-mono text-xs text-muted-foreground">STEP {index + 1}</p>
              <h2 className="mt-2 text-lg font-semibold">{step}</h2>
            </article>
          ))}
        </section>
        <section className="rounded-xl border bg-card p-5 sm:p-6">
          <div className="flex items-center gap-3"><Terminal className="h-5 w-5 text-emerald-500" /><h2 className="text-xl font-semibold">Quick start</h2></div>
          <p className="mt-3 leading-6 text-muted-foreground">Use the workspace navigation to move between stories, characters, agent sessions, and settings. Every view is designed to remain usable on narrow screens.</p>
          <Link href="/dashboard" className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-primary px-5 font-medium text-primary-foreground">Go to workspace</Link>
        </section>
      </div>
    </main>
  );
}
