import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query'

export interface SearchParams {
  model: string
  filters?: Record<string, any>
  fields?: string[]
  limit?: number
  offset?: number
}

export interface SearchResponse<T = any> {
  count: number
  results: T[]
}

const DEFAULT_TIMEOUT = 30000

const axiosInstance: AxiosInstance = axios.create({
  baseURL: '',
  headers: { 'Content-Type': 'application/json' },
  timeout: DEFAULT_TIMEOUT,
})

export async function searchApi<T = any>(params: SearchParams, config?: AxiosRequestConfig): Promise<SearchResponse<T>> {
  const body = {
    model: params.model,
    filters: params.filters || {},
    fields: params.fields || undefined,
    limit: params.limit ?? 100,
    offset: params.offset ?? 0,
  }

  const res = await axiosInstance.post<SearchResponse<T>>('/api/v1/search/', body, config)
  return res.data
}

export function useSearch<T = any>(
  params: SearchParams | null,
  options?: UseQueryOptions<SearchResponse<T>, Error>
): UseQueryResult<SearchResponse<T>, Error> {
  return useQuery<SearchResponse<T>, Error>(
    [
      'search',
      params ? params.model : null,
      params ? JSON.stringify(params.filters || {}) : null,
      params ? (params.fields || []).join(',') : null,
      params ? params.limit : null,
      params ? params.offset : null,
    ],
    () => {
      if (!params) {
        // should not run because enabled is false when params is null
        throw new Error('Missing search params')
      }
      return searchApi<T>(params)
    },
    {
      enabled: !!params,
      ...options,
    }
  )
}

export { axiosInstance }
export default searchApi
