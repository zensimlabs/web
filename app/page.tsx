import { CopyCommand } from "./components";

const REPO = "https://github.com/zensimlabs/zensim";
const INSTALL = "curl -fsSL https://zensimlabs.com/install.sh | sh";

const facts = [
  { n: "146", label: "STM32 profiles" },
  { n: "23", label: "boards" },
  { n: "149", label: "device models" },
  { n: "235", label: "scenarios" },
];

const features = [
  {
    title: "Deterministic to the picosecond",
    body: "Time is virtual and every external input is timestamped. A scenario that passes once passes always, however fast or busy the host is — which is what makes a simulator run worth putting in CI.",
  },
  {
    title: "Your firmware, unmodified",
    body: "The same ELF you flash on the board. The console, the LEDs, the timers and the DMA are the real register interfaces, so the firmware cannot tell it is not on silicon until it reads something nobody modelled.",
  },
  {
    title: "Peripheral models, not stubs",
    body: "149 device kinds: USART with its FIFO, timers to the advanced ones, RCC with a clock tree per family, flash with its programming sequences, ADC, SPI, I²C, CAN, SDMMC, QSPI, USB, Ethernet. What is missing says so and is counted.",
  },
  {
    title: "Scripted, and honest about it",
    body: "Load an ELF, wait for text on a UART, type into it, read memory, set a breakpoint, drive a pin, assert. Scenarios run in parallel with a timeout each and write JUnit, so a failure names the expectation it broke.",
  },
  {
    title: "Boards from your devicetree",
    body: "Point the importer at the flattened devicetree your firmware build leaves behind and it writes the platform file: memory map, peripherals, NVIC lines, bus clocks, DMA requests, console, LEDs, buttons.",
  },
  {
    title: "One binary",
    body: "No emulator, no JIT, no toolchain at run time, no container. A Cortex-M interpreter written in Rust, the models beside it, and a Starlark reader for the platforms and the scenarios.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
      <header className="flex flex-col items-start gap-8">
        <div className="flex items-center gap-3">
          <span className="font-mono text-2xl font-semibold tracking-tight text-accent">
            zensim
          </span>
          <span className="rounded-full border border-line px-2.5 py-0.5 font-mono text-xs text-muted">
            v0.1.0
          </span>
        </div>

        <h1 className="max-w-3xl text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
          A deterministic full-system simulator for{" "}
          <span className="text-accent">STM32 firmware</span>.
        </h1>

        <p className="max-w-2xl text-lg leading-relaxed text-muted">
          Boot the same firmware you flash on a NUCLEO board, drive its console
          from a script, assert on what it prints, and get the same result every
          time — on any host, in any order, as many times as you like.
        </p>

        <CopyCommand command={INSTALL} />

        <p className="font-mono text-xs text-muted">
          macOS arm64 today. Other platforms build from source with a Rust
          toolchain.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={REPO}
            className="rounded-md border border-line px-4 py-2 text-sm transition hover:border-accent hover:text-accent"
          >
            Source on GitHub
          </a>
          <a
            href={`${REPO}#get-started`}
            className="rounded-md px-4 py-2 text-sm text-muted transition hover:text-text"
          >
            Documentation
          </a>
        </div>
      </header>

      <section className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-4">
        {facts.map((f) => (
          <div key={f.label} className="bg-ink px-5 py-6">
            <div className="font-mono text-3xl font-semibold text-text">
              {f.n}
            </div>
            <div className="mt-1 text-sm text-muted">{f.label}</div>
          </div>
        ))}
      </section>

      <section className="mt-20">
        <h2 className="text-sm font-semibold tracking-widest text-muted uppercase">
          What it does
        </h2>
        <div className="mt-8 grid gap-10 sm:grid-cols-2">
          {features.map((f) => (
            <div key={f.title}>
              <h3 className="text-lg font-semibold text-text">{f.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <h2 className="text-sm font-semibold tracking-widest text-muted uppercase">
          A scenario
        </h2>
        <pre className="mt-6 overflow-x-auto rounded-lg border border-line bg-ink-soft p-5 font-mono text-sm leading-relaxed">
          <code>{`m = platform("//boards/st/nucleo_h743zi.star")
m.load_elf("build/zephyr/zephyr.elf")

console = m.device("usart3")
console.echo(True)
console.wait_for("*** Booting Zephyr OS", timeout = "1s")
console.wait_for("Hello World! nucleo_h743zi", timeout = "1s")
log("booted in %d us (%d instructions)" % (m.now_ns() // 1000, m.instructions()))`}</code>
        </pre>
        <p className="mt-4 text-sm text-muted">
          Run it with <code className="font-mono text-text">zensim run</code>, or
          a directory of them with{" "}
          <code className="font-mono text-text">zensim test</code>.
        </p>
      </section>

      <section className="mt-20 rounded-lg border border-line bg-ink-soft p-6">
        <h2 className="text-sm font-semibold tracking-widest text-muted uppercase">
          What it is not, yet
        </h2>
        <ul className="mt-4 space-y-2 leading-relaxed text-muted">
          <li>
            A profile&apos;s clocks are fixed at the frequency the generator
            chose; the clock tree answers its registers but the models do not
            follow a change.
          </li>
          <li>TrustZone has its registers and filters no access.</li>
          <li>
            Some scenarios need a firmware built from a workspace of your own,
            and skip cleanly without it.
          </li>
          <li>Only STM32 is published. Other vendors exist and do not ship.</li>
        </ul>
      </section>

      <footer className="mt-20 flex flex-col gap-4 border-t border-line pt-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <span>© 2026 Zensim Labs</span>
        <span className="flex gap-5">
          <a href={REPO} className="transition hover:text-text">
            GitHub
          </a>
          <a
            href={`${REPO}/blob/main/LICENSE`}
            className="transition hover:text-text"
          >
            AGPL-3.0
          </a>
          <a
            href={`${REPO}/issues`}
            className="transition hover:text-text"
          >
            Issues
          </a>
        </span>
      </footer>
    </main>
  );
}
