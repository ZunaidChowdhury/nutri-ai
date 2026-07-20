import { serverMutation } from '@/lib/core/server';
import type { NutritionReportResponse, NutritionReport } from '@/lib/types/nutrition';

export async function analyzeNutrition(token: string): Promise<NutritionReport | null> {
  try {
    const res = await serverMutation<NutritionReportResponse>('/agents/nutrition-analysis', {
      method: 'POST',
      body: {},
      token,
    });
    return res.data;
  } catch {
    return null;
  }
}
