<?php

namespace App\Http\Middleware;

use App\Models\Olimpiada;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckFase
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $fase): Response
    {
        $olimpiada = Olimpiada::latest()->first();

        if (!$olimpiada || $olimpiada->fase !== $fase) {
            return response()->json([
                'message' => 'Acción no permitida en la fase actual de la olimpiada.',
                'fase_actual' => $olimpiada?->fase,
                'fase_requerida' => $fase,
            ], 403);
        }

        return $next($request);
    }
}
