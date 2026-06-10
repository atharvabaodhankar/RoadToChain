"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  filename?: string;
  language?: string;
  code: string;
  children?: React.ReactNode;
}

export default function CodeBlock({
  filename = "SmartAccount.sol",
  language = "solidity",
  code,
  children,
  className,
  ...rest
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  // Extract raw text if children is provided but no code prop is given
  const getRawCode = (): string => {
    if (code) return code.trim();
    if (children) {
      if (typeof children === "string") return children.trim();
      // If it's a standard React node from MDX, extract the text content recursively
      const extractText = (node: React.ReactNode): string => {
        if (!node) return "";
        if (typeof node === "string") return node;
        if (Array.isArray(node)) return node.map(extractText).join("");
        if (typeof node === "object" && node !== null && "props" in node) {
          const props = (node as { props?: { children?: React.ReactNode } }).props;
          if (props && props.children) return extractText(props.children);
        }
        return "";
      };
      return extractText(children).trim();
    }
    return "";
  };

  const handleCopy = async () => {
    const raw = getRawCode();
    try {
      await navigator.clipboard.writeText(raw);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code: ", err);
    }
  };

  const displayCode = getRawCode();

  return (
    <div 
      className={`my-6 overflow-hidden rounded-xl border border-border bg-[var(--code-bg)] ${className || ""}`}
      {...rest}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-border bg-[var(--code-header-bg)] px-4 py-3">
        {/* Mac OS Window Controls */}
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          
          {/* Filename */}
          <span className="ml-4 font-mono text-xs font-medium text-dim tracking-tight">
            {filename}
          </span>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Language badge */}
          {language && (
            <span className="font-mono text-[10px] font-semibold text-dim uppercase tracking-wider bg-bg4 px-2 py-0.5 rounded border border-border">
              {language}
            </span>
          )}

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-md border border-border p-1.5 font-mono text-[11px] text-muted transition-colors hover:bg-bg3 hover:text-text cursor-pointer"
            aria-label="Copy code block"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-green-400" />
                <span className="text-green-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Area */}
      <div className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[var(--code-text)] scrollbar-thin">
        {children ? (
          <pre className="m-0 bg-transparent p-0 select-text overflow-visible">
            {children}
          </pre>
        ) : (
          <pre className="m-0 bg-transparent p-0 select-text overflow-visible">
            <code>{displayCode}</code>
          </pre>
        )}
      </div>
    </div>
  );
}
