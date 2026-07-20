export interface NutritionReport {
  summary: string;
  deficiencies: string[];
  suggestions: string[];
}

export interface NutritionReportResponse {
  success: boolean;
  data: NutritionReport;
}
