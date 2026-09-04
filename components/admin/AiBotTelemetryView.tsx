"use client";

import React, { useEffect, useState } from "react";
import {
  DollarSign,
  Cpu,
  HelpCircle,
  ShieldCheck,
  RefreshCw,
  Clock,
  Sparkles,
  Zap,
} from "lucide-react";
import type { AdminBotStats } from "@/lib/bot/telemetry";

export default function AiBotTelemetryView() {
  const [stats, setStats] = useState<AdminBotStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/bot-stats");
      if (!res.ok) {
        throw new Error(`Failed to load AI statistics (${res.status})`);
      }
      const data = await res.json();
      setStats(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error fetching bot telemetry");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading && !stats) {
    return (
      <div className="text-center py-24 space-y-3">
        <RefreshCw className="h-8 w-8 text-purple-600 dark:text-purple-400 animate-spin mx-auto" />
        <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
          Loading AI Bedrock Telemetry & Costs...
        </p>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 rounded-xl p-5 text-xs font-mono text-rose-700 dark:text-rose-300 space-y-2">
        <div className="font-bold flex items-center gap-2">
          <span>Failed to load AI Telemetry</span>
        </div>
        <p>{error}</p>
        <button
          onClick={fetchStats}
          className="mt-2 px-3 py-1.5 rounded-lg bg-rose-100 dark:bg-rose-500/20 hover:bg-rose-200 dark:hover:bg-rose-500/30 text-rose-800 dark:text-rose-200 text-[11px] font-mono transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const allTime = stats?.allTime || {
    queries: 0,
    inputTokens: 0,
    outputTokens: 0,
    embeddingTokens: 0,
    totalTokens: 0,
    totalCostUSD: 0,
  };

  const breaker = stats?.circuitBreaker || { todayQueries: 0, dailyMax: 500 };

  return (
    <div className="space-y-8">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">
              AWS Bedrock & Nova Cost Telemetry
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400">
              Active Tracking
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Real-time token counts, per-query pricing calculations, and monthly accounting logs.
          </p>
        </div>

        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-750 text-zinc-700 dark:text-zinc-200 text-xs font-mono transition-colors disabled:opacity-50 self-start sm:self-auto shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-purple-600 dark:text-purple-400 ${loading ? "animate-spin" : ""}`} />
          <span>{loading ? "Refreshing..." : "Refresh Stats"}</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Cost Card */}
        <div className="bg-white dark:bg-zinc-900/40 border border-purple-200 dark:border-purple-500/30 rounded-xl p-4 space-y-2 relative overflow-hidden shadow-sm">
          <div className="absolute top-3 right-3 text-purple-600 dark:text-purple-400">
            <DollarSign className="h-5 w-5" />
          </div>
          <div className="font-mono text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400">
            Total Spend (All-Time)
          </div>
          <div className="text-2xl font-bold font-mono text-purple-700 dark:text-purple-300">
            ${allTime.totalCostUSD.toFixed(5)}
          </div>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
            Nova Micro ($0.035/1M) + Titan v2
          </p>
        </div>

        {/* Total Tokens Card */}
        <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 space-y-2 relative overflow-hidden shadow-sm">
          <div className="absolute top-3 right-3 text-cyan-600 dark:text-cyan-400">
            <Cpu className="h-5 w-5" />
          </div>
          <div className="font-mono text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400">
            Total Tokens Consumed
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
            {allTime.totalTokens.toLocaleString()}
          </div>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
            In: {allTime.inputTokens.toLocaleString()} | Out: {allTime.outputTokens.toLocaleString()}
          </p>
        </div>

        {/* Total Queries Card */}
        <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 space-y-2 relative overflow-hidden shadow-sm">
          <div className="absolute top-3 right-3 text-emerald-600 dark:text-emerald-400">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div className="font-mono text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400">
            Total Questions Answered
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {allTime.queries.toLocaleString()}
          </div>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
            Avg: {allTime.queries > 0 ? Math.round(allTime.totalTokens / allTime.queries) : 0} tokens / query
          </p>
        </div>

        {/* Daily Circuit Breaker Status */}
        <div className="bg-white dark:bg-zinc-900/40 border border-emerald-200 dark:border-emerald-500/30 rounded-xl p-4 space-y-2 relative overflow-hidden shadow-sm">
          <div className="absolute top-3 right-3 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="font-mono text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400">
            Circuit Breaker (Today)
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
            {breaker.todayQueries} / {breaker.dailyMax}
          </div>
          <p className="text-[10px] text-emerald-700/80 dark:text-emerald-400/80 font-mono">
            Safe (Hard daily cap prevents bill shock)
          </p>
        </div>
      </div>

      {/* Monthly Accounting Table */}
      <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
              Monthly Cost & Token Accounting
            </h3>
          </div>
          <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
            {stats?.months.length || 0} billing cycles recorded
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-950/40 font-semibold">
                <th className="py-3 px-4">Billing Month</th>
                <th className="py-3 px-4">Queries</th>
                <th className="py-3 px-4">Input Tokens</th>
                <th className="py-3 px-4">Output Tokens</th>
                <th className="py-3 px-4">Embedding Tokens</th>
                <th className="py-3 px-4">Total Tokens</th>
                <th className="py-3 px-4 text-right">Total Cost (USD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-zinc-700 dark:text-zinc-300">
              {stats?.months.map((m) => (
                <tr key={m.month} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-purple-700 dark:text-purple-300">{m.month}</td>
                  <td className="py-3.5 px-4">{m.queries.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-zinc-500 dark:text-zinc-400">{m.inputTokens.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-zinc-500 dark:text-zinc-400">{m.outputTokens.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-zinc-500 dark:text-zinc-400">{m.embeddingTokens.toLocaleString()}</td>
                  <td className="py-3.5 px-4 font-semibold text-zinc-900 dark:text-zinc-100">{m.totalTokens.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                    ${m.totalCostUSD.toFixed(5)}
                  </td>
                </tr>
              ))}

              {(!stats?.months || stats.months.length === 0) && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-zinc-400 dark:text-zinc-500">
                    No monthly telemetry logged yet. Ask a question through RTC Navigator to begin tracking!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Column Section: Pricing Breakdown & Last 14 Days */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Pricing Reference */}
        <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/60 flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
              Active Pricing Rates & Guardrails
            </h3>
          </div>

          <div className="p-5 space-y-4 text-xs font-mono">
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800">
                <div className="space-y-0.5">
                  <div className="text-zinc-900 dark:text-zinc-200 font-bold">Amazon Nova Micro (Input)</div>
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400">Prompt & RAG context tokens</div>
                </div>
                <div className="text-purple-700 dark:text-purple-400 font-bold">$0.035 / 1M tokens</div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800">
                <div className="space-y-0.5">
                  <div className="text-zinc-900 dark:text-zinc-200 font-bold">Amazon Nova Micro (Output)</div>
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400">Generated assistant completions</div>
                </div>
                <div className="text-purple-700 dark:text-purple-400 font-bold">$0.140 / 1M tokens</div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800">
                <div className="space-y-0.5">
                  <div className="text-zinc-900 dark:text-zinc-200 font-bold">Amazon Titan Embeddings v2</div>
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400">1024-dim normalized query vectors</div>
                </div>
                <div className="text-purple-700 dark:text-purple-400 font-bold">$0.020 / 1M tokens</div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800">
                <div className="space-y-0.5">
                  <div className="text-zinc-900 dark:text-zinc-200 font-bold">Upstash Vector & Redis</div>
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400">Similarity search & rate limiting</div>
                </div>
                <div className="text-emerald-700 dark:text-emerald-400 font-bold">$0.00 (10k free/day)</div>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/30 text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
              🛡️ <strong>Budget Shield Active</strong>: Even if 500 questions are asked every day of the month, your total monthly AWS Bedrock bill will stay under <strong>$2.00 USD</strong>.
            </div>
          </div>
        </div>

        {/* Daily Breakdown (Last 14 Days) */}
        <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden flex flex-col shadow-sm">
          <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
                Daily Breakdown (Last 14 Days)
              </h3>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[300px]">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-950/40 font-semibold">
                  <th className="py-2.5 px-4">Date</th>
                  <th className="py-2.5 px-4">Queries</th>
                  <th className="py-2.5 px-4">Tokens</th>
                  <th className="py-2.5 px-4 text-right">Cost (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-zinc-700 dark:text-zinc-300">
                {stats?.recentDays.map((d) => (
                  <tr key={d.date} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/20 transition-colors">
                    <td className="py-2.5 px-4 text-zinc-800 dark:text-zinc-300">{d.date}</td>
                    <td className="py-2.5 px-4 font-semibold text-zinc-900 dark:text-zinc-100">{d.queries}</td>
                    <td className="py-2.5 px-4 text-zinc-500 dark:text-zinc-400">{d.totalTokens.toLocaleString()}</td>
                    <td className="py-2.5 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      ${d.totalCostUSD.toFixed(5)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Real-time Query Activity Log */}
      <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
              Recent AI Invocations Log (Latest 25)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
            Includes latency & token economics
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-950/40 font-semibold">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Prompt Preview</th>
                <th className="py-3 px-4">Input Tokens</th>
                <th className="py-3 px-4">Output Tokens</th>
                <th className="py-3 px-4">Latency</th>
                <th className="py-3 px-4 text-right">Cost (USD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-zinc-700 dark:text-zinc-300">
              {stats?.recentQueries.map((q, idx) => (
                <tr key={idx} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/20 transition-colors">
                  <td className="py-3 px-4 text-zinc-500 dark:text-zinc-400 text-[11px]">
                    {q.timestamp ? new Date(q.timestamp).toLocaleTimeString() : "—"}
                  </td>
                  <td className="py-3 px-4 max-w-[280px] truncate text-zinc-900 dark:text-zinc-200 font-medium">
                    {q.promptPreview || "—"}
                  </td>
                  <td className="py-3 px-4 text-zinc-500 dark:text-zinc-400">{q.inputTokens}</td>
                  <td className="py-3 px-4 text-zinc-500 dark:text-zinc-400">{q.outputTokens}</td>
                  <td className="py-3 px-4 text-zinc-500 dark:text-zinc-400">{q.latencyMs ? `${q.latencyMs}ms` : "—"}</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                    ${q.costUSD.toFixed(6)}
                  </td>
                </tr>
              ))}

              {(!stats?.recentQueries || stats.recentQueries.length === 0) && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-400 dark:text-zinc-500">
                    No recent queries logged yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
