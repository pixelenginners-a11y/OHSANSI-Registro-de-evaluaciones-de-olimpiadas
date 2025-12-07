<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Services\PhaseEnforcerService;

class PhaseGuard
{
    public function handle(Request $request, Closure $next, string $funcionalidad): Response
    {
        $enforcer = app(PhaseEnforcerService::class);
        $check = $enforcer->checkFunctionalityAllowed($funcionalidad);

        if (!$check['allowed']) {
            return response()->json(['message' => $check['message']], 403);
        }

        return $next($request);
    }
}
