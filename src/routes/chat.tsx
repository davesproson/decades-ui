import { createFileRoute } from '@tanstack/react-router'
import Chat from '@/chat/chat'
import Navbar from '@/navbar'

export const Route = createFileRoute('/chat')({
  component: () => <Navbar ><Chat /></Navbar>,
  beforeLoad: () => {}
})