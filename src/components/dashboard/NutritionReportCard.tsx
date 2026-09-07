'use client';

import { Card, Chip } from '@heroui/react';
import type { NutritionReport } from '@/lib/types/nutrition';

interface NutritionReportCardProps {
  report: NutritionReport;
}

export function NutritionReportCard({ report }: NutritionReportCardProps) {
  const isNotEnoughData = report.summary.toLowerCase().includes('not enough data');

  if (isNotEnoughData) {
    return (
      <Card className="border border-border dark:border-border">
        <Card.Content className="p-6 flex flex-col items-center gap-3 text-center">
          <p className="text-muted">{report.summary}</p>
          {report.suggestions.map((s, i) => (
            <p key={i} className="text-sm text-muted">{s}</p>
          ))}
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card className="border border-border dark:border-border">
      <Card.Header className="pb-0 px-6 pt-6">
        <h2 className="text-lg font-semibold">Nutrition Analysis</h2>
      </Card.Header>
      <Card.Content className="p-6 flex flex-col gap-5">
        <div>
          <h3 className="text-sm font-semibold text-muted uppercase tracking-wide mb-2">
            Summary
          </h3>
          <p className="text-sm text-default dark:text-muted leading-relaxed">
            {report.summary}
          </p>
        </div>

        {report.deficiencies.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wide mb-2">
              Potential Deficiencies
            </h3>
            <div className="flex flex-wrap gap-2">
              {report.deficiencies.map((d, i) => (
                <Chip key={i} variant="soft" color="warning" size="sm">
                  {d}
                </Chip>
              ))}
            </div>
          </div>
        )}

        {report.suggestions.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wide mb-2">
              Suggestions
            </h3>
            <ul className="flex flex-col gap-2">
              {report.suggestions.map((s, i) => (
                <li key={i} className="text-sm text-default dark:text-muted flex items-start gap-2">
                  <span className="text-accent mt-0.5">•</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card.Content>
    </Card>
  );
}