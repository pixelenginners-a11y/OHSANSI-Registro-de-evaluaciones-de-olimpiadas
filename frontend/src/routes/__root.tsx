// src/routes/_root.tsx
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import Footer from '../components/Footer'

const RootLayout = () => (
  <>
    <Outlet />
    <Footer />
    <TanStackRouterDevtools />
  </>
)

export const Route = createRootRoute({
  component: RootLayout,
})
