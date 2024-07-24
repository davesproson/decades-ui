import { AlarmConfig } from '@/alarms/alarm-config'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/alarms/config')({
  component: () => <AlarmConfig />,
})