// src/routes/_root.tsx
import { createRootRoute, Outlet } from '@tanstack/react-router'

const RootLayout = () => (
  <>
    <Outlet />
  </>
)

export const Route = createRootRoute({
  component: RootLayout,
})
