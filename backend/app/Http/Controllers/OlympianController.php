<?php

namespace App\Http\Controllers;

use App\Http\Requests\OlympianRequest;
use App\Services\CsvOlympianImporter;
use Illuminate\Http\JsonResponse;
use App\Models\Olympian;
use Illuminate\Http\Request;
use App\Services\OlympianService;
class OlympianController extends Controller
{
    private OlympianService $importer;

    public function __construct(OlympianService $importer)
    {
        $this->importer = $importer;
    }

    public function import(Request $request): JsonResponse
    {
        $data = $request->all();
        $res = $this->importer->import($data);
        return response()->json([
            'message' => 'Import ejecutado con éxito',
            'data' => $res,
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
