"use client";

import { useState } from "react";

export function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex w-full max-w-2xl items-stretch overflow-hidden rounded-lg border border-line bg-ink-soft">
      <code className="flex-1 overflow-x-auto px-4 py-3 text-left font-mono text-sm whitespace-nowrap text-text">
        <span className="text-muted select-none">$ </span>
        {command}
      </code>
      <button
        onClick={copy}
        aria-label="Copy the install command"
        className="shrink-0 cursor-pointer border-l border-line px-4 font-mono text-xs tracking-wide text-muted transition hover:bg-accent-soft hover:text-accent"
      >
        {copied ? "copied" : "copy"}
      </button>
    </div>
  );
}
