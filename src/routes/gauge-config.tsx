import { createFileRoute } from '@tanstack/react-router'
import GaugeConfigurator from '@/gauges/gauge-config'
import Navbar from '@/navbar'

export const Route = createFileRoute('/gauge-config')({
  component: () => <Navbar><GaugeConfigurator /></Navbar>,
  beforeLoad: () => {}
})