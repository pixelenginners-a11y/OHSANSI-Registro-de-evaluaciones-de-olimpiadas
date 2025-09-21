import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import Footer from '../components/Footer'
import Header from '../components/Header'

const RootLayout = () => (
  <>
    <Header />
    <hr />
    <Outlet />
    <Footer />
    <TanStackRouterDevtools />
  </>
)

export const Route = createRootRoute({ component: RootLayout })
