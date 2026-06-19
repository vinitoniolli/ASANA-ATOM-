import { useEffect, useEffectEvent, useRef, useState } from 'react'
import type { DashboardResponse, LoadStatus } from '../types/dashboard'
import { parseDashboardResponse } from '../utils/dashboard'


interface DashboardState {
  data?: DashboardResponse
  status: LoadStatus
  error: string | null
  isRefreshing: boolean
}

export function useDashboardData(endpoint: string) {
  const abortRef = useRef<AbortController | null>(null)
  const [state, setState] = useState<DashboardState>({
    data: undefined,
    status: 'loading',
    error: null,
    isRefreshing: false,
  })

  const fetchDashboard = useEffectEvent(async (reason: 'initial' | 'manual' | 'poll') => {
    abortRef.current?.abort()

    const controller = new AbortController()
    abortRef.current = controller

    setState((current) => ({
      ...current,
      status: current.data ? current.status : 'loading',
      error: null,
      isRefreshing: reason !== 'initial' || Boolean(current.data),
    }))

    try {
      const response = await fetch(`${endpoint}?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-store',
        },
        signal: controller.signal,
      })

      if (!response.ok) {
        throw new Error(`Falha ao carregar os dados (${response.status}).`)
      }

      const payload = (await response.json()) as unknown
      const parsed = parseDashboardResponse(payload)

      setState({
        data: parsed,
        status: 'success',
        error: null,
        isRefreshing: false,
      })
    } catch (error) {
      if (controller.signal.aborted) {
        return
      }

      const message =
        error instanceof Error ? error.message : 'Não foi possível carregar os dados agora.'

      setState((current) => ({
        ...current,
        status: current.data ? 'success' : 'error',
        error: message,
        isRefreshing: false,
      }))
    }
  })

  useEffect(() => {
    void fetchDashboard('initial')

    return () => {
      abortRef.current?.abort()
    }
  }, [])

  return {
    ...state,
    refresh: () => fetchDashboard('manual'),
  }
}