import Chat from '@/chat/chat'
import Navbar from '@/navbar'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/chat/')({
  component: () => <Navbar ><Chat /></Navbar>,
})