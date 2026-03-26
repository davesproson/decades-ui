import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Plot } from '../plot'

vi.mock('../dashboard/dashboard', () => ({
    PlotHeaderDash: () => null,
}))

const ref = React.createRef<HTMLDivElement>()

describe('Plot stale overlay', () => {

    it('does not show overlay when isStale is false', () => {
        render(<Plot ref={ref} parameters={null} loadDone={true}
            staleState={{ isStale: false, staleSeconds: 0, dismissed: false, onDismiss: vi.fn() }} />)
        expect(screen.queryByText('Data feed not updating')).not.toBeInTheDocument()
    })

    it('shows overlay when isStale is true and not dismissed', () => {
        render(<Plot ref={ref} parameters={null} loadDone={true}
            staleState={{ isStale: true, staleSeconds: 10, dismissed: false, onDismiss: vi.fn() }} />)
        expect(screen.getByText('Data feed not updating')).toBeInTheDocument()
        expect(screen.getByText('Last data received 10 seconds ago.')).toBeInTheDocument()
    })

    it('does not show overlay when dismissed', () => {
        render(<Plot ref={ref} parameters={null} loadDone={true}
            staleState={{ isStale: true, staleSeconds: 10, dismissed: true, onDismiss: vi.fn() }} />)
        expect(screen.queryByText('Data feed not updating')).not.toBeInTheDocument()
    })

    it('calls onDismiss when the dismiss button is clicked', () => {
        const onDismiss = vi.fn()
        render(<Plot ref={ref} parameters={null} loadDone={true}
            staleState={{ isStale: true, staleSeconds: 10, dismissed: false, onDismiss }} />)
        fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }))
        expect(onDismiss).toHaveBeenCalledOnce()
    })

    it('displays the correct stale seconds in the overlay message', () => {
        render(<Plot ref={ref} parameters={null} loadDone={true}
            staleState={{ isStale: true, staleSeconds: 42, dismissed: false, onDismiss: vi.fn() }} />)
        expect(screen.getByText('Last data received 42 seconds ago.')).toBeInTheDocument()
    })

})
