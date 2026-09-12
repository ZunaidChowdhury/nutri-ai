import { serverFetch, serverMutation } from '@/lib/core/server';

export interface Cuisine {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CuisinesResponse {
  success: boolean;
  data: Cuisine[];
}

export interface CuisineResponse {
  success: boolean;
  data: Cuisine;
}

export async function getAllCuisines(): Promise<Cuisine[]> {
  const res = await serverFetch<CuisinesResponse>('/cuisines');
  return res.data;
}

export async function createCuisine(
  name: string,
  token: string
): Promise<Cuisine> {
  const res = await serverMutation<CuisineResponse>('/cuisines', {
    method: 'POST',
    body: { name },
    token,
  });
  return res.data;
}
