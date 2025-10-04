<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!$request->user()) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        $userRole = $request->user()->role->name;

        // Administradores tienen acceso a todo
        if ($userRole === 'Administrador') {
            return $next($request);
        }

        // Verificar si el rol del usuario está en los roles permitidos
        if (!in_array($userRole, $roles)) {
            return response()->json(['error' => 'No autorizado para esta acción'], 403);
        }

        return $next($request);
    }
}
