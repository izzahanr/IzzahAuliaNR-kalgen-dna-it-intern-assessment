import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-assessment-biopharma.kalbe.co.id';
const APP_ID = process.env.APP_ID || '';
const APP_KEY = process.env.APP_KEY || '';

export async function fetchKalbeApi(endpoint: string, options: RequestInit = {}) {
  const token = (await cookies()).get('access_token')?.value;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'app_id': APP_ID,
    'app_key': APP_KEY,
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/api/v1/feature${endpoint}`, {
    ...options,
    headers,
  });

  return res;
}

export function buildPaginationHeaders(page: number, limit: number, search?: string, sortCode?: string, sortOrder: string = 'ASC') {
  const offset = (page - 1) * limit;
  const headers: Record<string, string> = {
    'X-PAGING-Offset': offset.toString(),
    'X-PAGING-Limit': limit.toString(),
    'X-PAGING-SortOrder': sortOrder,
  };

  if (sortCode) {
    headers['X-PAGING-SortBy'] = sortCode;
  }

  if (search) {
    headers['X-PAGING-Search'] = search;
  }

  return headers;
}
