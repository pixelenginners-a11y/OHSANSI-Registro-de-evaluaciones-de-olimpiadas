<?php

namespace App\Services;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Models\Olympian;

use function PHPSTORM_META\map;

class OlympianService
{
    public function create(array $data)
    {
        return Olympian::create([
            'full_name' => $data['full_name'],
            'identity_document' => $data['identity_document'],
            'educational_institution' => $data['educational_institution'],
            'department' => $data['department'],
            'academic_tutor' => $data['academic_tutor'] ?? null,
        ]);
    }

    public function getAll()
    {
        return Olympian::all();
    }

    public function store(array $data)
    {
        return Olympian::create($data);
    }

    public function findById(string $id)
    {
        return Olympian::find($id);
    }

    public function update(string $id, array $data)
    {
        $olympian = Olympian::find($id);

        if (!$olympian) {
            return null;
        }

        $olympian->update($data);
        return $olympian;
    }

    public function delete(string $id)
    {
        $olympian = Olympian::find($id);

        if (!$olympian) {
            return false;
        }

        $olympian->delete();
        return true;
    }
}
