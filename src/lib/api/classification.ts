import { serverMutation } from '@/lib/core/server';

export interface ClassificationResult {
  cuisineTag: string;
  confidence: number;
}

interface ClassificationResponse {
  success: boolean;
  data: ClassificationResult;
}

export async function classifyMeal(
  title: string,
  description: string,
  token: string
): Promise<ClassificationResult | null> {
  try {
    const res = await serverMutation<ClassificationResponse>('/agents/food-classification', {
      method: 'POST',
      body: { title, description },
      token,
    });
    return res.data;
  } catch {
    return null;
  }
}
