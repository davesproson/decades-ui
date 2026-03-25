import { useEffect, useRef, useState } from 'react'
import { getData } from './utils'
import { DecadesDataResponse, GetDataOptions } from './types'

export const usePollingData = (
    options: GetDataOptions,
    intervalMs: number = 1000
): { data: DecadesDataResponse | undefined, error: unknown } => {
    const [data, setData] = useState<DecadesDataResponse | undefined>(undefined)
    const [error, setError] = useState<unknown>(null)

    const optionsRef = useRef(options)
    const intervalRef = useRef(intervalMs)
    optionsRef.current = options
    intervalRef.current = intervalMs

    useEffect(() => {
        let mounted = true
        let timeoutId: ReturnType<typeof setTimeout> | null = null

        const schedule = () => {
            timeoutId = setTimeout(tick, intervalRef.current)
        }

        const tick = () => {
            if (document.visibilityState !== 'visible') {
                schedule()
                return
            }
            getData(optionsRef.current)
                .then(result => {
                    if (!mounted) return
                    setData(result)
                    setError(null)
                })
                .catch(err => {
                    if (!mounted) return
                    setError(err)
                })
                .finally(() => {
                    if (!mounted) return
                    schedule()
                })
        }

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && timeoutId !== null) {
                clearTimeout(timeoutId)
                timeoutId = null
                tick()
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)
        tick()

        return () => {
            mounted = false
            if (timeoutId !== null) {
                clearTimeout(timeoutId)
                timeoutId = null
            }
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    }, []) // options/interval accessed via refs; effect intentionally runs once

    return { data, error }
}
