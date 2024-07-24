import Tephigram from '@/tephigram/tephigram'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/tephigram/')({
  component: () => <Tephigram />,
})