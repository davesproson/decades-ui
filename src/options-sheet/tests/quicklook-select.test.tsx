import { describe, it, expect } from 'vitest'
import { renderWithStore } from '@/tests'
import { QuicklookSwitch } from '../quicklook-select'
import { act, waitFor } from '@testing-library/react'

describe('Test quicklook select', async () => {

    it('Should render quicklook select', async () => {
        const { getByText } = renderWithStore(<QuicklookSwitch />)
        expect(getByText('Quicklook Mode')).toBeInTheDocument()
    })

    it('Should toggle the quicklook mode when clicked', async () => {
        const { store, getByText } = renderWithStore(<QuicklookSwitch />)
        expect(store.getState().config.quickLookMode).toBe(false)
        
        act(() => {
            getByText('Quicklook Mode').click()
        })

        await waitFor(() => {
            expect(store.getState().config.quickLookMode).toBe(true)
        })

        act(() => {
            getByText('Quicklook Mode').click()
        })

        await waitFor(() => {
            expect(store.getState().config.quickLookMode).toBe(false)
        })
    })
})