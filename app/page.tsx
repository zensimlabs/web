import Link from "next/link";
import { InstallCommand } from "./components";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const REPO = "https://github.com/zensimlabs/zensim";
const INSTALL = "curl -fsSL https://zensimlabs.com/install.sh | sh";

const numbers = [
  { n: "146", label: "STM32 profiles" },
  { n: "23", label: "boards" },
  { n: "149", label: "device models" },
  { n: "235", label: "scenarios" },
];

const features = [
  {
    title: "Deterministic to the picosecond",
    body: "Time is virtual and every external input is timestamped. A run that passes once passes always, however fast or busy the host is — which is what makes a simulator worth putting in CI.",
  },
  {
    title: "Your firmware, unmodified",
    body: "The same ELF you flash on the board. The console, the LEDs, the timers and the DMA are the real register interfaces, so the firmware cannot tell the difference until it reads something nobody modelled.",
  },
  {
    title: "Peripheral models, not stubs",
    body: "USART with its FIFO, timers to the advanced ones, RCC with a clock tree per family, flash with its programming sequences, ADC, SPI, I²C, CAN, SDMMC, QSPI, USB, Ethernet. What is missing says so and is counted.",
  },
  {
    title: "Scripted, and honest about it",
    body: "Wait for text on a UART, type into it, read memory, set a breakpoint, drive a pin, assert. Scenarios run in parallel with a timeout each and write JUnit, so a failure names the expectation it broke.",
  },
  {
    title: "Boards from your devicetree",
    body: "Point the importer at the flattened devicetree your firmware build leaves behind and it writes the platform file: memory map, peripherals, NVIC lines, bus clocks, DMA requests, console, LEDs, buttons.",
  },
  {
    title: "One binary",
    body: "No emulator, no JIT, no toolchain at run time, no container. A Cortex-M interpreter in Rust, the models beside it, and a Starlark reader for the platforms and the scenarios.",
  },
];

const limits = [
  "A profile's clocks are fixed at the frequency the generator chose; the clock tree answers its registers but the models do not follow a change.",
  "TrustZone has its registers and filters no access.",
  "Some scenarios need a firmware built from a workspace of your own, and skip cleanly without it.",
  "Only STM32 is published. Other vendors exist and do not ship.",
];

export default function Home() {
  return (
    <div className="min-h-svh">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-base font-semibold tracking-tight">
              zensim
            </span>
            <Badge variant="secondary" className="font-mono text-[10px]">
              v0.1.0
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Link
              href="#features"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              Features
            </Link>
            <Link
              href="#install"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              Install
            </Link>
            <a
              href={REPO}
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              GitHub →
            </a>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6">
        <section className="grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-[1.05fr_1fr]">
          <div className="flex flex-col items-start gap-7">
          <Badge variant="outline" className="font-mono text-xs">
            AGPL-3.0 · Rust · one binary
          </Badge>

          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl sm:leading-[1.05]">
            Run STM32 firmware in CI, and get the same answer every time.
          </h1>

          <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
            zensim boots the firmware you flash on the board, on models of the
            silicon, under virtual time. A script drives the console and judges
            the run — so a test that passes once passes always, on any host.
          </p>

          <div className="flex w-full flex-col gap-3">
            <InstallCommand command={INSTALL} />
            <p className="text-muted-foreground font-mono text-xs">
              macOS arm64 today. Elsewhere, a Rust toolchain builds it.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a href={REPO} className={buttonVariants()}>
              Read the source →
            </a>
            <a
              href={`${REPO}/releases/latest`}
              className={buttonVariants({ variant: "outline" })}
            >
              Releases
            </a>
          </div>
          </div>

          <Card className="overflow-hidden py-0 shadow-sm">
            <div className="flex items-center gap-2 border-b px-4 py-2.5">
              <span className="bg-muted-foreground/25 size-2.5 rounded-full" />
              <span className="bg-muted-foreground/25 size-2.5 rounded-full" />
              <span className="bg-muted-foreground/25 size-2.5 rounded-full" />
              <span className="text-muted-foreground ml-2 font-mono text-xs">
                zensim test tests/scenarios -j 4
              </span>
            </div>
            <CardContent className="p-0">
              <pre className="overflow-x-auto px-4 py-4 font-mono text-[11.5px] leading-[1.7] sm:text-xs">
                <code>
                  <span className="text-muted-foreground">
                    running 235 scenario(s), 4 at a time
                  </span>
                  {"\n"}
                  <span className="text-brand">PASS</span>
                  {"  stm32f4_peripherals   virtual   1.204ms   wall  0.061s\n"}
                  <span className="text-brand">PASS</span>
                  {"  stm32h7_full          virtual  3.7785s    wall 22.301s\n"}
                  <span className="text-brand">PASS</span>
                  {"  stm32l0_lowpower      virtual  412.0ms    wall  0.088s\n"}
                  <span className="text-brand">PASS</span>
                  {"  zephyr_hello_h743     virtual   84.9ms    wall  0.412s\n"}
                  <span className="text-muted-foreground">
                    {"────────────────────────────────────────────────\n"}
                  </span>
                  {"235 scenarios: "}
                  <span className="text-brand">208 passed</span>
                  {", 0 failed, 27 skipped\n"}
                  <span className="text-muted-foreground">
                    {"same virtual time on every host, every run"}
                  </span>
                </code>
              </pre>
            </CardContent>
          </Card>
        </section>

        <section className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-4">
          {numbers.map((f) => (
            <div key={f.label} className="bg-background px-5 py-6">
              <div className="font-mono text-3xl font-semibold tracking-tight">
                {f.n}
              </div>
              <div className="text-muted-foreground mt-1 text-sm">
                {f.label}
              </div>
            </div>
          ))}
        </section>

        <section id="features" className="scroll-mt-20 py-20 sm:py-28">
          <h2 className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
            What it does
          </h2>
          <div className="mt-10 grid gap-x-12 gap-y-10 sm:grid-cols-2">
            {features.map((f) => (
              <div key={f.title}>
                <h3 className="text-lg font-semibold tracking-tight">
                  {f.title}
                </h3>
                <p className="text-muted-foreground mt-2 leading-relaxed">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <Separator />

        <section className="grid gap-10 py-20 sm:grid-cols-2 sm:py-28">
          <div>
            <h2 className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
              A scenario
            </h2>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              Platforms and scenarios are Starlark files. Load an ELF, wait for
              what the firmware prints, assert on it. Run one with{" "}
              <code className="text-foreground font-mono text-sm">
                zensim run
              </code>
              , or a directory of them in parallel with{" "}
              <code className="text-foreground font-mono text-sm">
                zensim test
              </code>
              .
            </p>
          </div>
          <Card className="overflow-hidden py-0">
            <CardContent className="p-0">
              <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed">
                <code>{`m = platform("//boards/st/nucleo_h743zi.star")
m.load_elf("build/zephyr/zephyr.elf")

console = m.device("usart3")
console.echo(True)
console.wait_for("Hello World!", timeout = "1s")
log("booted in %d us" % (m.now_ns() // 1000))`}</code>
              </pre>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section id="install" className="scroll-mt-20 py-20 sm:py-28">
          <h2 className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
            Install
          </h2>
          <div className="mt-6 flex flex-col gap-4">
            <InstallCommand command={INSTALL} />
            <p className="text-muted-foreground max-w-2xl leading-relaxed">
              It reads the latest release, checks its SHA-256, and installs the
              binary and the platform library. It clones nothing and compiles
              nothing.{" "}
              <code className="text-foreground font-mono text-sm">
                ZENSIM_VERSION
              </code>
              ,{" "}
              <code className="text-foreground font-mono text-sm">
                ZENSIM_INSTALL_DIR
              </code>{" "}
              and{" "}
              <code className="text-foreground font-mono text-sm">
                ZENSIM_NO_MODIFY_PATH
              </code>{" "}
              change what it does.
            </p>
          </div>
        </section>

        <Separator />

        <section className="py-20 sm:py-28">
          <h2 className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
            What it is not, yet
          </h2>
          <ul className="text-muted-foreground mt-6 max-w-3xl space-y-3 leading-relaxed">
            {limits.map((l) => (
              <li key={l} className="flex gap-3">
                <span className="text-brand select-none">—</span>
                <span>{l}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="border-t">
        <div className="text-muted-foreground mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-sm sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Zensim Labs</span>
          <div className="flex gap-6">
            <a href={REPO} className="hover:text-foreground transition">
              GitHub
            </a>
            <a
              href={`${REPO}/blob/main/LICENSE`}
              className="hover:text-foreground transition"
            >
              AGPL-3.0
            </a>
            <a
              href={`${REPO}/issues`}
              className="hover:text-foreground transition"
            >
              Issues
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
