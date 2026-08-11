import { useEffect, useState } from "react";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Check,
  Cpu,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { Link } from "wouter";

const cards = [
  {
    title: "Health Dashboard",
    icon: Activity,
    desc: "12 active services, latency 18ms",
    shortcut: "⌘+H",
  },
  {
    title: "Cluster Management",
    icon: Cpu,
    desc: "Autoscaling active in 4 regions",
    shortcut: "⌘+C",
  },
  {
    title: "Security Logs",
    icon: ShieldCheck,
    desc: "Last audit performed 2m ago",
    shortcut: "⌘+S",
  },
  {
    title: "Real-time Telemetry",
    icon: BarChart3,
    desc: "Throughput 1.2M requests/min",
    shortcut: "⌘+T",
  },
];

export default function Home() {
  const [activeCard, setActiveCard] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(
      () => setActiveCard(value => (value + 1) % cards.length),
      4500
    );
    return () => window.clearInterval(timer);
  }, []);
  const card = cards[activeCard];
  const Icon = card.icon;

  return (
    <main className="min-h-screen overflow-hidden bg-[#030405] text-white selection:bg-emerald-400/30">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-32 h-[600px] w-[600px] rounded-full bg-emerald-400/15 blur-[120px] animate-pulse" />
        <div className="absolute -bottom-40 right-[10%] h-[500px] w-[500px] rounded-full bg-emerald-400/10 blur-[120px]" />
        <div className="absolute right-[15%] top-[30%] h-[400px] w-[400px] rounded-full bg-emerald-400/10 blur-[120px]" />
      </div>

      <nav className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-6 md:px-10 md:py-8">
        <Link href="/" className="font-mono text-lg font-bold tracking-[0.3em]">
          BL<span className="text-emerald-400">1</span>NK
        </Link>
        <div className="hidden items-center gap-8 text-xs font-medium text-white/60 md:flex">
          <Link className="transition hover:text-emerald-400" href="/dashboard">
            Workspace
          </Link>
          <Link className="transition hover:text-emerald-400" href="/outlines">
            Automations
          </Link>
          <Link
            className="transition hover:text-emerald-400"
            href="/characters"
          >
            Docs
          </Link>
          <Link className="transition hover:text-emerald-400" href="/settings">
            Pricing
          </Link>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <Link
            href="/dashboard"
            className="hidden text-white/60 transition hover:text-white sm:block"
          >
            Log in
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg bg-white px-4 py-2 font-bold text-black transition hover:bg-emerald-400 hover:shadow-[0_0_35px_rgba(52,211,153,.55)]"
          >
            Sign up
          </Link>
        </div>
      </nav>

      <section className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-4 pb-20 pt-12 text-center md:pt-20">
        <div className="relative z-20 mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">
          <span>New</span>
          <span className="h-1 w-1 rounded-full bg-emerald-400" />
          <span>Global Dashboard v4.0</span>
        </div>
        <h1 className="relative z-20 max-w-4xl text-[clamp(2.25rem,7vw,5.5rem)] font-bold leading-[1.05] tracking-tight">
          The developer interface
          <br />
          <span className="text-white/55">you&apos;ve been waiting for.</span>
        </h1>
        <p className="relative z-20 mt-7 max-w-2xl text-[15px] leading-relaxed text-white/70 md:text-lg">
          BL1NK aggregates your entire cloud infrastructure into a singular,
          high-performance command layer. Zero friction, total control.
        </p>
        <div className="relative z-30 mt-9 flex w-full flex-col items-center gap-3 px-5 sm:w-auto sm:flex-row sm:px-0">
          <Link
            href="/dashboard"
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-8 font-bold text-black transition hover:bg-emerald-400 hover:shadow-[0_0_45px_rgba(52,211,153,.8)] sm:w-auto"
          >
            <Terminal className="h-4 w-4" />
            Get Started for Free
          </Link>
          <Link
            href="/characters"
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-emerald-400/25 bg-emerald-400/[.06] px-8 font-bold text-white/80 backdrop-blur-2xl transition hover:border-emerald-400/50 hover:text-white sm:w-auto"
          >
            Documentation <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="relative z-30 mt-6 flex gap-4 font-mono text-[11px] text-white/45">
          <span className="flex items-center gap-1">
            <Check className="h-3 w-3 text-emerald-500" />
            No credit card
          </span>
          <span className="flex items-center gap-1">
            <Check className="h-3 w-3 text-emerald-500" />
            Self-hosted option
          </span>
        </div>

        <div className="relative z-0 mt-28 h-[320px] w-full max-w-3xl [perspective:1200px] md:mt-36 md:h-[350px]">
          {cards.map((item, index) => {
            const offset = (index - activeCard + cards.length) % cards.length;
            const visible = offset < 3;
            const CardIcon = item.icon;
            return (
              <div
                key={item.title}
                className={`absolute left-1/2 top-1/2 flex h-full w-[92%] -translate-x-1/2 -translate-y-1/2 flex-col justify-between rounded-2xl border border-emerald-400/25 bg-gradient-to-br from-emerald-400/[.08] to-emerald-400/[.01] p-5 text-left shadow-[0_0_60px_rgba(0,0,0,.6),0_0_50px_rgba(52,211,153,.15)] backdrop-blur-2xl transition-all duration-1000 md:w-full md:p-8 ${visible ? "opacity-100" : "pointer-events-none opacity-0"}`}
                style={{
                  transform: `translate(-50%, calc(-50% + ${offset * 18}px)) translateZ(${-offset * 50}px) scale(${1 - offset * 0.04})`,
                  zIndex: cards.length - offset,
                }}
              >
                <div>
                  <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardIcon className="h-5 w-5 text-emerald-400" />
                      <h2 className="text-lg font-bold tracking-tight md:text-xl">
                        {item.title}
                      </h2>
                    </div>
                    <span className="rounded border border-white/10 px-2 py-0.5 font-mono text-[10px] text-white/45">
                      {item.shortcut}
                    </span>
                  </div>
                  <p className="text-sm text-white/70 md:text-base">
                    {item.desc}
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-white/5 pt-6">
                  <div className="flex gap-2">
                    <span className="h-1.5 w-12 rounded-full bg-emerald-400/30">
                      <span className="block h-full w-2/3 rounded-full bg-emerald-400" />
                    </span>
                    <span className="h-1.5 w-12 rounded-full bg-white/5" />
                  </div>
                  <span className="font-mono text-[9px] font-bold uppercase tracking-[.2em] text-emerald-400/40">
                    BL1NK Core
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
