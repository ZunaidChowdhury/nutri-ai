'use client';

import type { NutritionReport } from '@/lib/types/nutrition';

interface NutritionReportCardProps {
  report: NutritionReport;
}

export function NutritionReportCard({ report }: NutritionReportCardProps) {
  const isNotEnoughData = report.summary.toLowerCase().includes('not enough data');

  if (isNotEnoughData) {
    return (
      <div className="rounded-2xl border border-[#DCE9E4] bg-white p-6 flex flex-col items-center gap-3 text-center">
        <div className="w-12 h-12 rounded-full bg-[#DDF5F0] flex items-center justify-center">
          <svg className="w-6 h-6 text-[#007F78]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-[#55706B] text-sm">{report.summary}</p>
        {report.suggestions.map((s, i) => (
          <p key={i} className="text-sm text-[#849A95]">{s}</p>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#DCE9E4] bg-white overflow-hidden">
      {/* Teal accent bar */}
      <div className="h-1 bg-gradient-to-r from-[#007F78] to-[#65B82E]" />

      <div className="p-6 flex flex-col gap-5">
        <h2 className="text-lg font-semibold text-[#163330]">Nutrition Analysis</h2>

        {/* Summary */}
        <div>
          <h3 className="text-xs font-semibold text-[#849A95] uppercase tracking-wide mb-2">
            Summary
          </h3>
          <p className="text-sm text-[#55706B] leading-relaxed">
            {report.summary}
          </p>
        </div>

        {/* Deficiencies */}
        {report.deficiencies.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-[#849A95] uppercase tracking-wide mb-2">
              Potential Deficiencies
            </h3>
            <div className="flex flex-wrap gap-2">
              {report.deficiencies.map((d, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions */}
        {report.suggestions.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-[#849A95] uppercase tracking-wide mb-2">
              Suggestions
            </h3>
            <ul className="flex flex-col gap-2">
              {report.suggestions.map((s, i) => (
                <li key={i} className="text-sm text-[#55706B] flex items-start gap-2">
                  <span className="text-[#007F78] mt-1.5 flex-shrink-0">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="4" />
                    </svg>
                  </span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}