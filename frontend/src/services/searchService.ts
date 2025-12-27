import { AxiosRequestConfig } from 'axios';
import { api } from './apiClient';
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

export interface SearchParams {
  model: string;
  filters?: Record<string, any>;
  fields?: string[];
  limit?: number;
  offset?: number;
}

export interface SearchResponse<T = any> {
  count: number;
  results: T[];
}


export async function searchApi<T = any>(params: SearchParams, config?: AxiosRequestConfig): Promise<SearchResponse<T>> {
  // We move the data to the 'params' key for a GET request
  const res = await api.get<SearchResponse<T>>('search/', {
    ...config,
    params: {
      model: params.model,
      // For complex objects in URLs, you often need to stringify them 
      // depending on how your backend expects to parse them.
      filters: params.filters ? JSON.stringify(params.filters) : undefined,
      fields: params.fields?.join(','),
      limit: params.limit ?? 100,
      offset: params.offset ?? 0,
    },
  });
  return res.data;
}

export function useSearch<T = any>(
  params: SearchParams | null,
  options?: UseQueryOptions<SearchResponse<T>, Error>
): UseQueryResult<SearchResponse<T>, Error> {
  return useQuery<SearchResponse<T>, Error>({
    // Updated TanStack Query v4/v5 syntax using an object
    queryKey: ['search', params], 
    queryFn: () => {
      if (!params) throw new Error('Missing search params');
      return searchApi<T>(params);
    },
    enabled: !!params,
    ...options,
  });
}

export default searchApi;