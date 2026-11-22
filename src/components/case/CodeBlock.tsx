"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

const KW =
  /\b(SELECT|FROM|WHERE|GROUP BY|ORDER BY|JOIN|USING|WITH|AS|CASE|WHEN|THEN|ELSE|END|AND|OR|ON|BETWEEN|DISTINCT|OVER|PARTITION BY|INTERVAL|NULLIF|DESC|ASC)\b/g;
const FN = /\b(MIN|MAX|COUNT|SUM|AVG|ROUND|DATE_TRUNC|EXTRACT|EPOCH|FLOOR|FIRST_VALUE|DATE)\b(?=\s*\()/g;

function highlight(code: string) {
  const esc = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return esc
    .split("\n")
    .map((line) => {
      const ci = line.indexOf("--");
      const body = ci >= 0 ? line.slice(0, ci) : line;
      const comment = ci >= 0 ? `<span class="cm">${line.slice(ci)}</span>` : "";
      return (
        body
          .replace(/('[^']*')/g, '<span class="str">$1</span>')
          .replace(FN, '<span class="fn">$1</span>')
          .replace(KW, '<span class="kw">$1</span>')
          .replace(/\b(\d+(?:\.\d+)?)\b(?![^<]*>)/g, '<span class="num">$1</span>') + comment
      );
    })
    .join("\n");
}

export function CodeBlock({ title, code }: { title: string; code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <figure className="overflow-hidden rounded-2xl border border-line bg-bg-2">
      <figcaption className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <span className="flex items-center gap-2 font-mono text-[11px] text-muted">
          <span className="rounded bg-accent-soft px-1.5 py-0.5 text-[10px] text-accent">SQL</span>
          {title}
        </span>
        <button
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(code);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            } catch {}
          }}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[11px] text-muted transition-colors hover:bg-fg/5 hover:text-fg"
          aria-label="Copy SQL"
        >
          {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </figcaption>
      <pre className="code-block overflow-x-auto p-4">
        <code dangerouslySetInnerHTML={{ __html: highlight(code) }} />
      </pre>
    </figure>
  );
}
