import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, cleanup, waitFor } from '@testing-library/react'

import { testComponents } from '../parameter-table'
import { testParameters } from './testdata'

describe('Test parameter availability hover card', () => {
    beforeEach(() => {
        cleanup()
    })

    it('Should render', async () => {
        const { AvailabiliyHoverCard } = testComponents
        render(<AvailabiliyHoverCard available={true} open={true}>Test</AvailabiliyHoverCard>)
        expect(screen.getByText('Available')).toBeDefined
        expect(screen.getByText('This parameter is available for selection and visualization.')).toBeDefined()
    })

    it('Should render unavailable', () => {
        const { AvailabiliyHoverCard } = testComponents
        render(<AvailabiliyHoverCard available={false} open={true}>Test</AvailabiliyHoverCard>)
        expect(screen.getByText('Unavailable')).toBeDefined()
        expect(screen.getByText('This parameter is not currently available, and cannot be selected.')).toBeDefined()
    })

    // TODO: Test the hover card trigger
})

describe('Test parameter table', () => {
    beforeEach(() => {
        cleanup()
    })

    it('Should render', () => {
        const { DumbParameterTable } = testComponents
        render(<DumbParameterTable params={[]} onToggleParam={() => { }} />)
        expect(screen.getByText('Parameter ID')).toBeDefined()
        expect(screen.getByText('Parameter Name')).toBeDefined()
        expect(screen.getByText('Units')).toBeDefined()
    })

    it('Should render parameters', () => {
        const { DumbParameterTable } = testComponents
        render(<DumbParameterTable params={testParameters} onToggleParam={() => { }} />)
        testParameters.forEach(param => {
            expect(screen.getByText(param.id)).toBeDefined()
            expect(screen.getByText(param.name)).toBeDefined()
            expect(screen.getByText(param.units)).toBeDefined()
        })
    })

    it('Should call onToggleParam when a parameter row is clicked', () => {
        const { DumbParameterTable } = testComponents
        const onToggleParam = vi.fn()
        render(<DumbParameterTable params={testParameters} onToggleParam={onToggleParam} />)
        testParameters.forEach(param => {
            const paramRow = screen.getByText(param.id).closest('tr')

            if (paramRow) {
                paramRow.click()
            }
        })
        expect(onToggleParam).toHaveBeenCalledTimes(testParameters.length)
    })

    it('Should call onToggleParam when a parameter button is clicked', () => {
        const { DumbParameterTable } = testComponents
        const onToggleParam = vi.fn()
        render(<DumbParameterTable params={testParameters} onToggleParam={onToggleParam} />)
        testParameters.forEach(param => {
            const paramButton = screen.getByText(param.name).closest('button')

            if (paramButton) {
                paramButton.click()
            }
        })
        // Once as the button is disabled for the two parameters
        expect(onToggleParam).toHaveBeenCalledTimes(1)
    })

    it('Should render a disabled button when a parameter is not available', () => {
        const { DumbParameterTable } = testComponents
        render(<DumbParameterTable params={testParameters} onToggleParam={() => { }} />)
        testParameters.forEach(param => {
            const paramButton = screen.getByText(param.name).closest('button')
            if (paramButton && !param.status) {
                expect(paramButton).toBeDisabled()
            }
        })
    })

    it('Should render a green row when a parameter is selected', () => {
        const { DumbParameterTable } = testComponents
        render(<DumbParameterTable params={testParameters} onToggleParam={() => { }} />)
        testParameters.forEach(param => {
            const paramRow = screen.getByText(param.id).closest('tr')
            if (paramRow && param.selected) {
                expect(paramRow).toHaveClass('bg-green-200 dark:bg-green-900')
            }
        })
    })

    it('Should render a red text when a parameter is unavailable', () => {
        const { DumbParameterTable } = testComponents
        render(<DumbParameterTable params={testParameters} onToggleParam={() => { }} />)
        testParameters.forEach(param => {
            // TODO: fix direct access of the node
            const paramRow = screen.getByText(param.id).closest('tr')
            if (paramRow && param.status === false && !param.selected) {
                expect(paramRow).toHaveClass('text-red-300 dark:text-red-900')
            }
        })
    })

    it('Should render a green check when a parameter is available', async () => {
        const { DumbParameterTable } = testComponents
        render(<DumbParameterTable params={testParameters} onToggleParam={() => { }} />)
        for (let param of testParameters) {
            if (param.status !== true) continue
            // TODO: fix direct access of the node
            const marker = screen.getByText(param.id).parentElement?.querySelector('svg')
            await waitFor(() => {
                expect(marker).toHaveClass('text-green-600 lucide-check')
            })
        }
    })

    it('Should render a red x when a parameter is unavailable', async () => {
        const { DumbParameterTable } = testComponents
        render(<DumbParameterTable params={testParameters} onToggleParam={() => { }} />)
        for (let param of testParameters) {
            if (param.status !== false) continue
            // TODO: fix direct access of the node
            const marker = screen.getByText(param.id).parentElement?.querySelector('svg')
            await waitFor(() => {
                expect(marker).toHaveClass('text-red-600 lucide-x')
            })
        }
    })

    it('Should render a gray circle when a parameter is unknown', async () => {
        const { DumbParameterTable } = testComponents
        render(<DumbParameterTable params={testParameters} onToggleParam={() => { }} />)
        for (let param of testParameters) {
            if (param.status !== null) continue
            // TODO: fix direct access of the node
            const marker = screen.getByText(param.id).parentElement?.querySelector('svg')
            await waitFor(() => {
                expect(marker).toHaveClass('text-gray-600 lucide-circle-help')
            })
        }
    })
})