import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { testComponents, testFunctions } from '../quicklook'
import QuicklookSelector from '../quicklook'
import { renderWithStore } from '@/tests'


const { QuicklookSelectorNoFlights, QuicklookSelectorFlightList } = testComponents
const { jobSortFn } = testFunctions
import { apiJobs, internalJobs } from './testdata'

const mocks = vi.hoisted(() => ({
    navigate: vi.fn(),
    fetch: vi.fn()
}))

vi.mock('@tanstack/react-router', async () => ({
    ...(await import('@tanstack/react-router')),
    useNavigate: () => mocks.navigate
}))

vi.mock('@/utils', async () => ({
    ...(await import('@/utils')),
    authFetch: mocks.fetch
}))


describe('Test QuicklookSelectorNoFlights', () => {

    beforeEach(() => {
        mocks.fetch.mockClear()
    })


    it('Should render', () => {
        const { getByText } = render(<QuicklookSelectorNoFlights onClick={() => { }} />)
        expect(getByText('No flights are currently available to view')).toBeDefined()
    })

    it('Should call onClick when button is clicked', () => {
        const onClick = vi.fn()
        const { getByText } = render(<QuicklookSelectorNoFlights onClick={onClick} />)
        getByText('Back').click()
        expect(onClick).toBeCalledTimes(1)
    })
})

describe('Test QuicklookSelectorFlightList', async () => {

    beforeEach(() => {
        mocks.fetch.mockClear()
    })


    it('Should render jobs', async () => {

        const { getByText } = render(<QuicklookSelectorFlightList jobs={internalJobs} onJobSelected={() => { }} />)

        internalJobs.forEach(job => {
            expect(getByText(`${job.flightNumber} (${job.flightProject}) ${job.flightDate}`)).toBeDefined()
        })
    })
})

describe('Test QuicklookSelector (integration)', () => {
    beforeEach(() => {
        mocks.fetch.mockClear()
    })

    it('Should render a loading state initially', async () => {
        mocks.fetch.mockResolvedValueOnce({
            json: () => Promise.resolve({ results: [] })
        })
        const { getByTestId } = renderWithStore(<QuicklookSelector />)
        await waitFor(() => {
            expect(getByTestId('decades-loader')).toBeDefined()
        })
    })

    it('Should render no flights message when no jobs are available', async () => {
        mocks.fetch.mockResolvedValueOnce({
            json: () => Promise.resolve({ results: [] })
        })
        const { getByText } = renderWithStore(<QuicklookSelector />)
        await waitFor(() => {
            expect(getByText('No flights are currently available to view')).toBeDefined()
        })
    })

    it('Should render a list of jobs when jobs are available', async () => {
        mocks.fetch.mockResolvedValue({
            json: () => Promise.resolve( apiJobs )
        })
        const { getByText } = renderWithStore(<QuicklookSelector />)
        await waitFor(() => {
            apiJobs.results.forEach(job => {
                expect(getByText(`${job.flight_number} (${job.flight_project}) ${job.flight_date}`)).toBeDefined()
            })
        })
    })

})


describe('Test the job sort function', () => {
    it('Should sort first by reverse flight date', () => {
        const jobs = [
            { flightNumber: 'C123', flightProject: 'Test', flightDate: '2020-01-01', jobID: 1 },
            { flightNumber: 'C124', flightProject: 'Test', flightDate: '2020-01-02', jobID: 1 },
            { flightNumber: 'C125', flightProject: 'Test', flightDate: '2020-01-03', jobID: 1 }
        ]
        const sorted = jobs.sort(jobSortFn)
        expect(sorted[0].flightNumber).toBe('C125')
        expect(sorted[1].flightNumber).toBe('C124')
        expect(sorted[2].flightNumber).toBe('C123')
    })
    it('Should sort second by flight number', () => {
        const jobs = [
            { flightNumber: 'C123', flightProject: 'Test', flightDate: '2020-01-01', jobID: 1 },
            { flightNumber: 'C124', flightProject: 'Test', flightDate: '2020-01-01', jobID: 1 },
            { flightNumber: 'C125', flightProject: 'Test', flightDate: '2020-01-01', jobID: 1 }
        ]
        const sorted = jobs.sort(jobSortFn)
        expect(sorted[0].flightNumber).toBe('C125')
        expect(sorted[1].flightNumber).toBe('C124')
        expect(sorted[2].flightNumber).toBe('C123')
    })
})