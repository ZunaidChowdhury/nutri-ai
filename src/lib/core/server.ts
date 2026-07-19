const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export class ApiError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

interface BaseOptions {
  token?: string;
  headers?: Record<string, string>;
}

interface ServerFetchOptions extends BaseOptions {
  params?: Record<string, string | number | boolean | undefined>;
  cache?: RequestCache;
  next?: { revalidate?: number; tags?: string[] };
}

interface ServerMutationOptions extends BaseOptions {
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
}

export async function serverFetch<T>(
  endpoint: string,
  options: ServerFetchOptions = {}
): Promise<T> {
  const url = new URL(`${API_BASE_URL}${endpoint}`);

  if (options.params) {
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (options.token) {
    headers['Authorization'] = `Bearer ${options.token}`;
  }

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers,
    cache: options.cache,
    next: options.next,
  });

  const json = await res.json();

  if (!res.ok) {
    throw new ApiError(
      json.message || 'An error occurred',
      json.code || 'SERVER_ERROR',
      res.status
    );
  }

  return json as T;
}

export async function serverMutation<T>(
  endpoint: string,
  options: ServerMutationOptions
): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...options.headers,
  };

  if (options.token) {
    headers['Authorization'] = `Bearer ${options.token}`;
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: options.method,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const json = await res.json();

  if (!res.ok) {
    throw new ApiError(
      json.message || 'An error occurred',
      json.code || 'SERVER_ERROR',
      res.status
    );
  }

  return json as T;
}

export async function getAuthToken(): Promise<string | null> {
  try {
    const { authClient } = await import('@/lib/auth/client');
    const { data } = await authClient.getSession();
    return data?.session?.token || null;
  } catch {
    return null;
  }
}
