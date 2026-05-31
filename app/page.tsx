import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BellRing,
  Boxes,
  BrainCircuit,
  MessagesSquare,
  ShieldCheck,
  Workflow,
} from "lucide-react";

const pillars = [
  {
    icon: Workflow,
    title: "Project control",
    description:
      "Boards, task flow, and activity history live in one workspace instead of being split across tools.",
  },
  {
    icon: MessagesSquare,
    title: "Realtime collaboration",
    description:
      "Channels, direct messages, notifications, and presence are designed as first-class system events.",
  },
  {
    icon: BrainCircuit,
    title: "Pulse intelligence",
    description:
      "The AI layer is scaffolded to summarize work, surface risk, and answer questions from the activity log.",
  },
];

const setupSteps = [
  "Copy .env.example into .env.local and supply real secrets locally.",
  "Run docker compose up -d to start MongoDB and Redis.",
  "Use npm run dev for the app and npm run check before each milestone.",
];

const foundation = [
  { label: "Env", value: "Validated and normalized" },
  { label: "Storage", value: "Mongo, Redis, S3, SMTP helpers" },
  { label: "Quality", value: "Lint, typecheck, Vitest" },
  { label: "Surface", value: "Landing shell plus health route" },
];

export default function Home() {
  return (
    <main className="relative isolate overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 -top-32 h-112 bg-[radial-gradient(circle_at_top,rgba(245,130,32,0.24),transparent_46%),radial-gradient(circle_at_70%_18%,rgba(13,148,136,0.18),transparent_28%)] blur-3xl" />

      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-16 px-6 py-10 sm:px-10 lg:px-14 lg:py-14">
        <header className="flex flex-col gap-8 rounded-4xl border border-white/60 bg-white/75 p-8 shadow-[0_30px_120px_-40px_rgba(15,23,42,0.45)] backdrop-blur md:p-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-3 rounded-full border border-(--line-soft) bg-(--surface-1) px-4 py-2 text-sm font-medium text-(--ink-muted)">
              <span className="h-2.5 w-2.5 rounded-full bg-(--accent)" />
              Zira foundation scaffold
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-(--line-soft) bg-background px-4 py-2 font-mono text-xs uppercase tracking-[0.24em] text-(--ink-soft)">
              Next 16 + React 19 + Tailwind 4
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(19rem,0.75fr)] lg:items-end">
            <div className="space-y-6">
              <p className="font-mono text-xs uppercase tracking-[0.32em] text-(--ink-soft)">
                Private work operating system
              </p>
              <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.06em] text-foreground sm:text-6xl lg:text-7xl">
                Projects, chat, presence, and operational signals in one controlled surface.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-(--ink-muted) sm:text-xl">
                This repo now starts from a production-grade platform baseline instead of the default Next.js starter. The next feature sprints can build against normalized config, reusable service clients, and verified test tooling.
              </p>
            </div>

            <div className="grid gap-3 rounded-[28px] border border-(--line-strong) bg-background p-6">
              <div className="flex items-center justify-between text-sm text-(--ink-muted)">
                <span>Readiness</span>
                <span className="font-mono uppercase tracking-[0.2em] text-(--ink-soft)">phase 01</span>
              </div>
              {foundation.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-2xl border border-(--line-soft) bg-(--surface-1) px-4 py-3"
                >
                  <span className="font-mono text-xs uppercase tracking-[0.22em] text-(--ink-soft)">
                    {item.label}
                  </span>
                  <span className="text-sm font-medium text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/api/health"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-white transition-transform duration-200 hover:-translate-y-0.5"
            >
              Check health route
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://nextjs.org/docs/app"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-(--line-strong) bg-white px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-(--surface-1)"
            >
              App Router reference
              <Boxes className="h-4 w-4" />
            </a>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-3">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;

            return (
              <article
                key={pillar.title}
                className="rounded-[28px] border border-(--line-soft) bg-white/80 p-7 shadow-[0_18px_70px_-45px_rgba(15,23,42,0.4)] backdrop-blur"
              >
                <div className="mb-6 inline-flex rounded-2xl bg-(--surface-2) p-3 text-(--accent-deep)">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-semibold tracking-[-0.04em] text-foreground">
                  {pillar.title}
                </h2>
                <p className="mt-4 text-base leading-7 text-(--ink-muted)">
                  {pillar.description}
                </p>
              </article>
            );
          })}
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.9fr)]">
          <article className="rounded-4xl border border-(--line-soft) bg-[linear-gradient(135deg,rgba(255,255,255,0.86),rgba(246,244,238,0.95))] p-8">
            <div className="flex items-center gap-3 text-(--accent-deep)">
              <ShieldCheck className="h-5 w-5" />
              <span className="font-mono text-xs uppercase tracking-[0.24em] text-(--ink-soft)">
                Setup sequence
              </span>
            </div>
            <ol className="mt-6 grid gap-4">
              {setupSteps.map((step, index) => (
                <li
                  key={step}
                  className="flex gap-4 rounded-2xl border border-(--line-soft) bg-white/80 px-4 py-4"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--surface-2) font-mono text-sm text-(--accent-deep)">
                    0{index + 1}
                  </span>
                  <p className="pt-1 text-sm leading-7 text-(--ink-muted)">{step}</p>
                </li>
              ))}
            </ol>
          </article>

          <article className="rounded-4xl border border-(--line-soft) bg-foreground p-8 text-white">
            <div className="flex items-center gap-3 text-(--accent-soft)">
              <Activity className="h-5 w-5" />
              <span className="font-mono text-xs uppercase tracking-[0.24em] text-white/60">
                System contract
              </span>
            </div>
            <div className="mt-6 grid gap-4 text-sm leading-7 text-white/72">
              <p>
                Route handlers can now consume a single validated env shape instead of reading unstructured process variables.
              </p>
              <p>
                Infrastructure helpers are separated by responsibility so the app can later split cleanly into web, gateway, and worker runtimes.
              </p>
              <p className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/80">
                <BellRing className="h-4 w-4 text-(--accent-soft)" />
                Use the health route to confirm environment normalization without exposing secrets.
              </p>
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}
