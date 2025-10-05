import { createFileRoute } from '@tanstack/react-router'
import LoginPage from '../../features/login/pages/loginPage'

export const Route = createFileRoute('/public/login')({
  component: LoginPage,
})
