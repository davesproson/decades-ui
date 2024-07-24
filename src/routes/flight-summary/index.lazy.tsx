import FlightSummary from '@/flight-summary/flight-summary'
import Navbar from '@/navbar'
import { createLazyFileRoute } from '@tanstack/react-router'
import Loader from '@/components/loader'

export const Route = createLazyFileRoute('/flight-summary/')({
  component: () => (
    <Navbar fixedWidth={false}>
      <FlightSummary />
    </Navbar>
  ),
  pendingComponent: () => <Loader />,
})