import GaugeConfigurator from '@/gauges/gauge-config'
import Navbar from '@/navbar'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/gauges/config')({
  component: () => <Navbar><GaugeConfigurator /></Navbar>,
})