<?php

namespace App\Services;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Models\Olympian;
use Illuminate\Http\Request;

use function PHPSTORM_META\map;

class OlympianService
{
    public function create(Request $req)
    {
        $validated = $req->validate([
            'full_name' => 'required|string|max:100',
            'identity_document' => 'required|string|max:20|unique:olympians,identity_document',
            'legal_guardian_contact' => 'required|string|max:100',
            'educational_institution' => 'required|string|max:100',
            'department' => 'required|string|max:50',
            'academic_tutor' => 'nullable|string|max:100',
        ]);
        return Olympian::create($validated);
    }

    public function import(array $data)
    {
        $validator = Validator::make($data, [
            'rows.*.full_name' => 'required|string|max:100',
            'rows.*.identity_document' => 'required|string|max:20|unique:olympians,identity_document',
            'rows.*.legal_guardian_contact' => 'required|string|max:100',
            'rows.*.educational_institution' => 'required|string|max:100',
            'rows.*.department' => 'required|string|max:50',
            'rows.*.school_grade' => 'required|string|max:50',
            'rows.*.academic_tutor' => 'nullable|string|max:100',
        ]);
        $validated = $validator->validate();
        $creados = collect($validated['rows'])->map(fn ($fila) => Olympian::create($fila));
        return $creados;
    }
}
