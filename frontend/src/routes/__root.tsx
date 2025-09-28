import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import Header from '../components/Header'
import Footer from '../components/Footer'

export interface RouterContext { queryClient: QueryClient }

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  notFoundComponent: () => <div className="p-4">No encontrado</div>, // opcional (quita el warning amarillo)
})

function RootLayout() {
  return (
    <div className="min-h-dvh bg-gray-50">
      <Header />
      <main className="mx-auto max-w-6xl p-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
