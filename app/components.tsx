"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function InstallCommand({ command }: { command: string }) {
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
    <div className="bg-card flex w-full max-w-xl items-stretch overflow-hidden rounded-lg border">
      <code className="text-foreground flex-1 overflow-x-auto px-4 py-3 font-mono text-sm whitespace-nowrap">
        <span className="text-muted-foreground select-none">$ </span>
        {command}
      </code>
      <Button
        onClick={copy}
        variant="ghost"
        size="sm"
        aria-label="Copy the install command"
        className="text-muted-foreground hover:text-foreground h-auto shrink-0 rounded-none border-l px-4 font-mono text-xs"
      >
        {copied ? "copied" : "copy"}
      </Button>
    </div>
  );
}
