import { describe, it, expect, vi, beforeAll, Mock } from 'vitest'
import { render } from '@testing-library/react'
import { Gauge, GaugePanel } from '../gauges'

// ResizeObserver is not available in jsdom — mock it to immediately
// fire with a fixed size so the SVG renders in tests.
beforeAll(() => {
    global.ResizeObserver = vi.fn().mockImplementation((callback: ResizeObserverCallback) => ({
        observe: vi.fn().mockImplementation((_el: Element) => {
            callback([{ contentRect: { width: 300, height: 200 } } as ResizeObserverEntry], {} as ResizeObserver)
        }),
        disconnect: vi.fn(),
    })) as unknown as typeof ResizeObserver
})

vi.mock('@/components/theme-provider', () => ({
    useDarkMode: vi.fn(() => false)
}))

vi.mock('../hooks', () => ({
    useGauge: vi.fn((configs: unknown[]) => configs)
}))

const baseConfig = {
    parameter: 'TEMP',
    longName: 'Temperature',
    units: 'K',
    value: 50,
    min: 0,
    max: 100,
    dangerBelow: null,
    dangerAbove: null,
}

describe('Gauge', () => {

    it('renders the display value', () => {
        const { getByText } = render(<Gauge {...baseConfig} value={42.5} />)
        expect(getByText('42.5')).toBeInTheDocument()
    })

    it('renders --- when value is null', () => {
        const { getByText } = render(<Gauge {...baseConfig} value={null} />)
        expect(getByText('---')).toBeInTheDocument()
    })

    it('renders --- when value is badData (-999.99)', () => {
        const { getByText } = render(<Gauge {...baseConfig} value={-999.99} />)
        expect(getByText('---')).toBeInTheDocument()
    })

    it('renders the min label', () => {
        const { getByText } = render(<Gauge {...baseConfig} min={-50} max={50} />)
        expect(getByText('-50')).toBeInTheDocument()
    })

    it('renders the max label', () => {
        const { getByText } = render(<Gauge {...baseConfig} min={-50} max={50} />)
        expect(getByText('50')).toBeInTheDocument()
    })

    it('renders the title with parameter and units', () => {
        const { getByText } = render(<Gauge {...baseConfig} />)
        expect(getByText('Temperature (K)')).toBeInTheDocument()
    })

    it('falls back to parameter name when longName is not set', () => {
        const { getByText } = render(<Gauge {...baseConfig} longName={undefined} />)
        expect(getByText('TEMP (K)')).toBeInTheDocument()
    })

    it('shows ? for units when not set', () => {
        const { getByText } = render(<Gauge {...baseConfig} units={undefined} />)
        expect(getByText('Temperature (?)')).toBeInTheDocument()
    })

    it('defaults min to 0 and max to 100 when null', () => {
        const { getByText } = render(<Gauge {...baseConfig} min={null} max={null} />)
        expect(getByText('0')).toBeInTheDocument()
        expect(getByText('100')).toBeInTheDocument()
    })

    it('renders no danger zone circles when dangerBelow and dangerAbove are null', () => {
        const { container } = render(<Gauge {...baseConfig} />)
        expect(container.querySelectorAll('circle')).toHaveLength(0)
    })

    it('renders a danger below circle when dangerBelow is within range', () => {
        const { container } = render(<Gauge {...baseConfig} dangerBelow={20} />)
        expect(container.querySelectorAll('circle')).toHaveLength(1)
    })

    it('renders a danger above circle when dangerAbove is within range', () => {
        const { container } = render(<Gauge {...baseConfig} dangerAbove={80} />)
        expect(container.querySelectorAll('circle')).toHaveLength(1)
    })

    it('renders both danger zone circles when both are within range', () => {
        const { container } = render(<Gauge {...baseConfig} dangerBelow={20} dangerAbove={80} />)
        expect(container.querySelectorAll('circle')).toHaveLength(2)
    })

    it('does not render danger below circle when dangerBelow equals min', () => {
        const { container } = render(<Gauge {...baseConfig} min={0} dangerBelow={0} />)
        expect(container.querySelectorAll('circle')).toHaveLength(0)
    })

    it('does not render danger above circle when dangerAbove equals max', () => {
        const { container } = render(<Gauge {...baseConfig} max={100} dangerAbove={100} />)
        expect(container.querySelectorAll('circle')).toHaveLength(0)
    })

    it('does not render SVG until dimensions are known', () => {
        // Override ResizeObserver to not fire the callback
        (global.ResizeObserver as Mock).mockImplementationOnce(() => ({
            observe: vi.fn(),
            disconnect: vi.fn(),
        }))
        const { container } = render(<Gauge {...baseConfig} />)
        expect(container.querySelector('svg')).toBeNull()
    })

})

describe('GaugePanel', () => {

    it('renders one gauge per config', () => {
        const configs = [baseConfig, { ...baseConfig, parameter: 'PRES' }]
        const { container } = render(<GaugePanel configs={configs} direction="row" />)
        expect(container.querySelectorAll('svg')).toHaveLength(2)
    })

    it('renders in row direction', () => {
        const { container } = render(<GaugePanel configs={[baseConfig]} direction="row" />)
        const panel = container.firstElementChild as HTMLElement
        expect(panel.style.flexDirection).toBe('row')
    })

    it('renders in column direction', () => {
        const { container } = render(<GaugePanel configs={[baseConfig]} direction="column" />)
        const panel = container.firstElementChild as HTMLElement
        expect(panel.style.flexDirection).toBe('column')
    })

    it('renders nothing when configs is empty', () => {
        const { container } = render(<GaugePanel configs={[]} direction="row" />)
        expect(container.querySelectorAll('svg')).toHaveLength(0)
    })

})
