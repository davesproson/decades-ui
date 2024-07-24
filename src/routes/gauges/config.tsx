import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/gauges/config')({
  beforeLoad: () => {}
})