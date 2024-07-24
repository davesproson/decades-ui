import { createLazyFileRoute } from '@tanstack/react-router'
import { Suspense, lazy } from 'react'
import Loader from '@/components/loader'

const DecadesMap = lazy(() => import('@/map/decadesMap'))
const Navbar = lazy(() => import('@/navbar'))

export const Route = createLazyFileRoute('/map/')({
  component: () => (
    <Navbar>
      <Suspense fallback={<Loader />}>
        <DecadesMap withMenu={true} />
      </Suspense>
    </Navbar>
  ),
  pendingComponent: () => <Loader />,
})