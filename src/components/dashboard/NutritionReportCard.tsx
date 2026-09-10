'use client';

import type { NutritionReport } from '@/lib/types/nutrition';

interface NutritionReportCardProps {
  report: NutritionReport;
}

export function NutritionReportCard({ report }: NutritionReportCardProps) {
  const isNotEnoughData = report.summary.toLowerCase().includes('not enough data');

  if (isNotEnoughData) {
    return (
      <div className="rounded-2xl border border-[#DCE9E4] dark:border-[#263835] bg-[#F7FAF8] dark:bg-[#161f1e] p-6 flex flex-col items-center gap-3 text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#DDF5F0] dark:bg-[#007F78]/20 flex items-center justify-center">
          <svg className="w-6 h-6 text-[#007F78] dark:text-[#2DD4BF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-[#163330] dark:text-[#E8F2EF]">{report.summary}</p>
        <div className="flex flex-col gap-1.5 max-w-md">
          {report.suggestions.map((s, i) => (
            <p key={i} className="text-xs text-[#55706B] dark:text-[#A1B8B3] leading-relaxed">
              {s}
            </p>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Executive Summary Callout */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#DDF5F0]/60 to-[#EAF7DE]/60 dark:from-[#007F78]/15 dark:to-[#65B82E]/15 border border-[#007F78]/20 dark:border-[#007F78]/30">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#007F78] text-white">
            AI Diagnosis
          </span>
          <span className="text-xs font-medium text-[#55706B] dark:text-[#A1B8B3]">Based on your 30-day nutrition habits</span>
        </div>
        <p className="text-sm font-medium text-[#163330] dark:text-[#E8F2EF] leading-relaxed">
          {report.summary}
        </p>
      </div>

      {/* Deficiencies section */}
      {report.deficiencies.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#92400E] dark:text-[#FCD34D] flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              Watchlist Deficiencies ({report.deficiencies.length})
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {report.deficiencies.map((d, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] dark:bg-[#F59E0B]/20 dark:text-[#FCD34D] dark:border-[#F59E0B]/30"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                {d}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions section */}
      {report.suggestions.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#007F78] dark:text-[#2DD4BF] flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-[#007F78] dark:text-[#2DD4BF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Personalized Action Items
          </span>
          <div className="grid grid-cols-1 gap-2">
            {report.suggestions.map((s, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl border border-[#DCE9E4] dark:border-[#263835] bg-[#F7FAF8] dark:bg-[#121918] hover:border-[#007F78]/40 transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-[#DDF5F0] dark:bg-[#007F78]/25 text-[#007F78] dark:text-[#2DD4BF] flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">
                  {i + 1}
                </div>
                <p className="text-xs text-[#163330] dark:text-[#E8F2EF] font-medium leading-relaxed">
                  {s}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}