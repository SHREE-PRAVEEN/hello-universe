import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Thesis />
      <WhatWeDo />
      <HowItWorks />
      <Applications />
      <Approach />
      <Research />
      <ProductsTeaser />
      <Vision />
    </>
  );
}

function Hero() {
  return (
    <section className="bp-grid relative overflow-hidden border-b border-line/80">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink" />
      <div className="relative mx-auto max-w-6xl px-6 py-28 md:py-36">
        <p className="font-mono text-xs uppercase tracking-widest text-signal">
          Robotics &amp; Artificial Intelligence
        </p>
        <h1 className="mt-6 max-w-3xl font-display text-4xl font-medium leading-[1.1] tracking-tight md:text-6xl">
          Building intelligent machines for the real world.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-dim">
          We create robotics and AI technologies that help machines see, understand,
          decide, and act — from perception software to the physical systems that
          carry it out.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/#technology"
            className="rounded-sm bg-paper px-6 py-3 text-sm font-medium text-ink transition hover:bg-white"
          >
            Explore robotics
          </Link>
          <Link
            href="/#technology"
            className="rounded-sm border border-line px-6 py-3 text-sm font-medium text-paper transition hover:border-dim"
          >
            Explore AI
          </Link>
        </div>
      </div>
    </section>
  );
}

function Thesis() {
  return (
    <section className="border-b border-line/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:gap-16">
        <h2 className="font-display text-2xl font-medium leading-tight md:text-3xl">
          The future is intelligent.
        </h2>
        <div className="space-y-4 text-dim">
          <p>
            Robots are becoming more capable. AI is becoming more powerful. Hello
            Universe brings them together — combining robotics, artificial
            intelligence, computer vision, autonomy, and edge computing into systems
            that work in real environments, not just in demonstrations.
          </p>
        </div>
      </div>
    </section>
  );
}

function WhatWeDo() {
  const pillars = [
    {
      label: "Robotics",
      body: "We design and develop robotic systems for real-world environments: autonomous robots, mobile platforms, manipulation systems, and the sensor suites that support them.",
    },
    {
      label: "Artificial Intelligence",
      body: "We build AI software that lets machines understand information and make decisions — machine learning, computer vision, deep learning, multimodal models, and AI agents.",
    },
    {
      label: "Computer Vision",
      body: "We give machines the ability to understand the visual world: object detection, tracking, image and scene understanding, and visual inspection.",
    },
  ];
  return (
    <section id="technology" className="border-b border-line/80">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-2xl font-medium md:text-3xl">What we do</h2>
        <div className="mt-12 grid gap-px overflow-hidden rounded-sm border border-line bg-line md:grid-cols-3">
          {pillars.map((p) => (
            <div key={p.label} className="bg-panel p-8">
              <div className="font-display text-lg font-medium text-paper">{p.label}</div>
              <p className="mt-3 text-sm leading-relaxed text-dim">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = ["World", "Sensors", "Perception", "AI / Reasoning", "Decision & Planning", "Control", "Robot", "Action"];
  return (
    <section id="how-it-works" className="border-b border-line/80 bg-panel/40">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-2xl font-medium md:text-3xl">From AI to action</h2>
        <p className="mt-3 max-w-xl text-dim">
          A typical Hello Universe system connects digital intelligence to physical
          action through a single pipeline.
        </p>
        <div className="mt-14 overflow-x-auto">
          <div className="flex min-w-[720px] items-center">
            {steps.map((step, i) => (
              <div key={step} className="flex items-center">
                <div className="flex flex-col items-center gap-2">
                  <span className="font-mono text-[11px] text-dim">{String(i + 1).padStart(2, "0")}</span>
                  <div className="rounded-sm border border-line bg-panel2 px-4 py-3 text-sm font-medium text-paper">
                    {step}
                  </div>
                </div>
                {i < steps.length - 1 && <div className="mx-2 h-px w-8 bg-line" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Applications() {
  const items = [
    ["Industry", "Automation, inspection, and monitoring."],
    ["Agriculture", "Intelligent monitoring and agricultural robotics."],
    ["Emergency response", "Search, rescue, and dangerous-environment operations."],
    ["Infrastructure", "Inspection and maintenance at scale."],
    ["Logistics", "Autonomous transportation and material handling."],
    ["Exploration", "Robotic systems for challenging environments."],
  ];
  return (
    <section id="applications" className="border-b border-line/80">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-2xl font-medium md:text-3xl">
          Where robotics can make a difference
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {items.map(([title, body]) => (
            <div key={title} className="border-l border-line pl-5">
              <div className="font-medium text-paper">{title}</div>
              <p className="mt-1 text-sm text-dim">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Approach() {
  const values = [
    ["Engineering", "Build reliable hardware and software."],
    ["Intelligence", "Develop capable AI systems."],
    ["Autonomy", "Reduce unnecessary human intervention."],
    ["Safety", "Keep humans in control when it matters."],
    ["Practicality", "Solve problems that actually matter."],
  ];
  return (
    <section className="border-b border-line/80 bg-panel/40">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-2xl font-medium md:text-3xl">
          Build. Test. Learn. Improve.
        </h2>
        <p className="mt-3 max-w-xl text-dim">
          Useful robotics requires more than impressive demonstrations.
        </p>
        <dl className="mt-12 grid gap-x-8 gap-y-6 sm:grid-cols-2">
          {values.map(([term, def]) => (
            <div key={term} className="flex gap-4">
              <dt className="w-32 shrink-0 font-mono text-sm text-signal">{term}</dt>
              <dd className="text-sm text-dim">{def}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Research() {
  const areas = [
    "Embodied AI",
    "Autonomous Robotics",
    "Computer Vision",
    "Robot Learning",
    "Edge AI",
    "Multimodal Intelligence",
    "Human-Robot Interaction",
    "Multi-Agent Systems",
    "Autonomous Navigation",
  ];
  return (
    <section id="research" className="border-b border-line/80">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-2xl font-medium md:text-3xl">
          Exploring what intelligent machines can become
        </h2>
        <div className="mt-10 flex flex-wrap gap-3">
          {areas.map((a) => (
            <span
              key={a}
              className="rounded-full border border-line px-4 py-1.5 text-sm text-dim"
            >
              {a}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductsTeaser() {
  return (
    <section className="border-b border-line/80 bg-panel/40">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="font-display text-2xl font-medium md:text-3xl">Our products</h2>
            <p className="mt-3 max-w-md text-dim">
              Software you can put to work today — SDKs, agent frameworks, and
              autonomy stacks, delivered straight to your inbox on purchase.
            </p>
          </div>
          <Link
            href="/products"
            className="rounded-sm border border-line px-6 py-3 text-sm font-medium text-paper transition hover:border-dim"
          >
            Browse the catalogue
          </Link>
        </div>
      </div>
    </section>
  );
}

function Vision() {
  return (
    <section id="vision" className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 py-24 text-center">
        <h2 className="mx-auto max-w-2xl font-display text-2xl font-medium leading-snug md:text-4xl">
          Machines handle what is dangerous, repetitive, difficult, or impossible.
          Humans focus on creativity, judgment, and what matters most.
        </h2>
        <p id="contact" className="mx-auto mt-6 max-w-lg text-dim">
          We&rsquo;re building the bridge between artificial intelligence and the
          physical world.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/signup"
            className="rounded-sm bg-signal px-6 py-3 text-sm font-medium text-ink transition hover:bg-signal/90"
          >
            Work with us
          </Link>
          <Link
            href="/products"
            className="rounded-sm border border-line px-6 py-3 text-sm font-medium text-paper transition hover:border-dim"
          >
            Explore our technology
          </Link>
        </div>
      </div>
    </section>
  );
}
