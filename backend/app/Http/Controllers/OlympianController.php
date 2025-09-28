<?php

namespace App\Http\Controllers;

use App\Http\Requests\OlympianRequest;
use App\Services\CsvOlympianImporter;
use Illuminate\Http\JsonResponse;
use App\Models\Olympian;

class OlympianController extends Controller
{
    public function import(OlympianRequest $request, CsvOlympianImporter $importer): JsonResponse
    {
        $filePath = $request->file('file')->getRealPath();

        $result = $importer->import($filePath);

        if ($result->invalidHeader) {
            return response()->json([
                'message'  => 'Encabezados inválidos',
                'esperado' => $result->expected,
                'recibido' => $result->received,
            ], 422);
        }

        return response()->json([
            'message'      => 'Importación procesada',
            'procesadas'   => $result->processed,
            'insertados'   => $result->inserted,
            'actualizados' => $result->updated,
            'errores'      => $result->errors,
        ]);
    }
    public function all(): JsonResponse
    {
        $olympians = Olympian::all();
        return response()->json([
            'data' => $olympians,
        ]);
    }
}
