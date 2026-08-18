import React, { useState } from 'react';
import { Copy, Check, Printer, Download, X } from 'lucide-react';
import { DecisionAnalysisResult } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  decision: DecisionAnalysisResult;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  decision,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateMarkdown = () => {
    let md = `# Decision Analysis: ${decision.title}\n\n`;
    md += `**Date:** ${new Date(decision.createdAt).toLocaleDateString()}\n`;
    if (decision.context) md += `**Context:** ${decision.context}\n\n`;

    md += `## 🏆 The Tiebreaker Verdict\n`;
    md += `**Recommended Choice:** ${decision.verdict?.winnerName} (${decision.verdict?.confidenceScore}% confidence)\n\n`;
    md += `**Summary:** ${decision.verdict?.summary}\n\n`;
    md += `**The Deciding Factor:** ${decision.verdict?.theDecidingFactor}\n\n`;
    md += `**Critical Trade-off:** ${decision.verdict?.criticalTradeoff}\n\n`;

    md += `### Recommended Action Plan\n`;
    (decision.verdict?.recommendedActionPlan || []).forEach((step, i) => {
      md += `${i + 1}. ${step}\n`;
    });
    md += `\n`;

    md += `## ⚖️ Pros & Cons Analysis\n\n`;
    (decision.optionsAnalysis || []).forEach((opt) => {
      md += `### ${opt.optionName}\n`;
      md += `**Pros:**\n`;
      opt.pros.forEach((p) => {
        md += `- [Impact +${p.impact}/5] [${p.category}] ${p.text}${p.explanation ? ` - ${p.explanation}` : ''}\n`;
      });
      md += `**Cons:**\n`;
      opt.cons.forEach((c) => {
        md += `- [Impact -${c.impact}/5] [${c.category}] ${c.text}${c.explanation ? ` - ${c.explanation}` : ''}\n`;
      });
      md += `\n`;
    });

    md += `## 📊 Side-by-Side Comparison Matrix\n\n`;
    md += `| Evaluation Factor | Weight | ${decision.options.map((o) => o.name).join(' | ')} |\n`;
    md += `|---|---|${decision.options.map(() => '---|').join('')}\n`;
    (decision.criteria || []).forEach((crit) => {
      const scores = decision.options.map((o) => `${crit.scores[o.id] ?? 5}/10`).join(' | ');
      md += `| **${crit.name}** | ${crit.weight}★ | ${scores} |\n`;
    });
    md += `\n`;

    md += `## 🧭 SWOT Analysis\n\n`;
    (decision.optionsAnalysis || []).forEach((opt) => {
      md += `### SWOT: ${opt.optionName}\n`;
      md += `**Strengths:** ${opt.swot.strengths.join('; ')}\n`;
      md += `**Weaknesses:** ${opt.swot.weaknesses.join('; ')}\n`;
      md += `**Opportunities:** ${opt.swot.opportunities.join('; ')}\n`;
      md += `**Threats:** ${opt.swot.threats.join('; ')}\n\n`;
    });

    return md;
  };

  const handleCopyMarkdown = async () => {
    const md = generateMarkdown();
    await navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(decision, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `tiebreaker-${decision.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#121212] border border-white/20 shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-[#D4FF00]" />
            <div>
              <h3 className="text-sm font-mono font-bold uppercase tracking-[0.25em] text-white">
                Export Decision Dossier
              </h3>
              <p className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                Formatted Markdown, Executive Print PDF, or JSON
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/40 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-[#080808] border-b border-white/10 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleCopyMarkdown}
            className="inline-flex items-center gap-2 bg-white hover:bg-[#D4FF00] text-black text-xs font-mono font-black uppercase tracking-widest px-4 py-2.5 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-black" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy Markdown'}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 bg-[#121212] hover:bg-white/10 text-white border border-white/20 text-xs font-mono font-bold uppercase tracking-widest px-4 py-2.5 transition-colors"
          >
            <Printer className="w-4 h-4 text-[#D4FF00]" />
            Print Executive PDF
          </button>

          <button
            type="button"
            onClick={handleDownloadJson}
            className="inline-flex items-center gap-2 bg-[#121212] hover:bg-white/10 text-white border border-white/20 text-xs font-mono font-bold uppercase tracking-widest px-4 py-2.5 transition-colors"
          >
            <Download className="w-4 h-4 text-[#D4FF00]" />
            Download JSON
          </button>
        </div>

        {/* Preview text */}
        <div className="p-4 flex-1 overflow-y-auto bg-[#080808] text-white/80 font-mono text-xs leading-relaxed">
          <pre className="whitespace-pre-wrap">{generateMarkdown()}</pre>
        </div>
      </div>
    </div>
  );
};
