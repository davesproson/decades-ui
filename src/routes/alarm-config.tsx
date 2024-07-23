import { AlarmConfig } from '@/alarms/alarm-config'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/alarm-config')({
  component: () => <AlarmConfig />,
  beforeLoad: () => {}
})