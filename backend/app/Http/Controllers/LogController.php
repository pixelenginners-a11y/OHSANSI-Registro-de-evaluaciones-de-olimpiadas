<?php

namespace App\Http\Controllers;

use App\Models\SystemLog;
use Illuminate\Http\Request;

class LogController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $role = $user?->role?->name;

        $query = SystemLog::query();

        // Scope por rol
        if ($role === 'Evaluador') {
            $query->where('actor_id', $user->id);
        } elseif ($role === 'Responsable Academico') {
            $areaId = $user->areaResponsable?->id;
            if ($areaId) {
                $query->where('area_id', $areaId);
            } else {
                return response()->json(['data' => [], 'total' => 0]);
            }
        }
        // Admin ve todo

        // Filtros
        if ($request->filled('user_id')) {
            $query->where('actor_id', $request->integer('user_id'));
        }
        if ($request->filled('role')) {
            $query->where('actor_role', $request->input('role'));
        }
        if ($request->filled('action')) {
            $query->where('action', $request->input('action'));
        }
        if ($request->filled('area_id')) {
            $query->where('area_id', $request->integer('area_id'));
        }
        if ($request->filled('grade_id')) {
            $query->where('grade_id', $request->integer('grade_id'));
        }
        if ($request->filled('phase')) {
            $query->where('phase', $request->input('phase'));
        }
        if ($request->filled('entity_type')) {
            $query->where('entity_type', $request->input('entity_type'));
        }
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date('date_from'));
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date('date_to'));
        }

        $logs = $query->orderByDesc('created_at')->paginate(20);

        return response()->json($logs);
    }
}
