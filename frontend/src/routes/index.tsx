import '../style/global.css'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome Home!
        </h3>
        <p className="text-gray-600">Has iniciado sesión correctamente 🚀</p>
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
          Explorar
        </button>
      </div>
    </div>
  )
}
