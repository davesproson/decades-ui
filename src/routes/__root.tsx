import { Error404, VistaError } from '@/components/errors'
import Loader  from '@/components/loader'
import { OptionsSheet } from '@/options-sheet/options'
import { createRootRoute, Outlet } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
        <OptionsSheet />
        <Outlet />
        {/* <TanStackRouterDevtools /> */}
    </>
  ),
  pendingComponent: () => <Loader />,
  errorComponent: ({error}) => <VistaError error={error} message="An error occured" />,
  notFoundComponent: () => <Error404 />,
})