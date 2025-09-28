<?php

namespace App\Services;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CsvOlympianImporter
{
    private const EXPECTED = [
        'full_name',
        'identity_document',
        'legal_guardian_contact',
        'educational_institution',
        'department',
        'school_grade',
        'academic_tutor',
    ];

    public function import(string $filePath): ImportResult
    {
        $handle = @fopen($filePath, 'r');
        if ($handle === false) {
            return ImportResult::fromError('No se pudo abrir el archivo');
        }

        try {
            $delimiter = $this->detectDelimiter($handle);

            [$validHeader, $received] = $this->validateHeader($handle, $delimiter);
            if (!$validHeader) {
                return ImportResult::fromInvalidHeader(self::EXPECTED, $received);
            }

            [$rows, $errors] = $this->readValidRows($handle, $delimiter);

            [$inserted, $updated] = $this->upsertWithMetrics('olympians', $rows, ['identity_document'], [
                'full_name',
                'legal_guardian_contact',
                'educational_institution',
                'department',
                'school_grade',
                'academic_tutor',
                'updated_at',
            ]);

            return new ImportResult(
                processed: count($rows),
                inserted: $inserted,
                updated:  $updated,
                errors:   $errors
            );
        } finally {
            fclose($handle);
        }
    }

    private function detectDelimiter($handle): string
    {
        $firstLine = fgets($handle);
        $delimiter = str_contains($firstLine, ';') ? ';' : ',';
        rewind($handle);
        return $delimiter;
    }

    private function validateHeader($handle, string $delimiter): array
    {
        $header = fgetcsv($handle, 0, $delimiter) ?: [];
        $received = array_map(fn($h) => strtolower(trim($h ?? '')), $header);
        $valid = ($received === self::EXPECTED);
        return [$valid, $received];
    }

    private function readValidRows($handle, string $delimiter): array
    {
        $rows = [];
        $errors = [];
        $line = 2; // después del header
        $now = Carbon::now();

        while (($data = fgetcsv($handle, 0, $delimiter)) !== false) {
            // línea vacía
            if (count($data) === 1 && trim($data[0]) === '') { $line++; continue; }

            $row = [
                'full_name'               => trim($data[0] ?? ''),
                'identity_document'       => trim($data[1] ?? ''),
                'legal_guardian_contact'  => trim($data[2] ?? ''),
                'educational_institution' => trim($data[3] ?? ''),
                'department'              => trim($data[4] ?? ''),
                'school_grade'            => trim($data[5] ?? ''),
                'academic_tutor'          => trim($data[6] ?? ''),
            ];

            $validator = Validator::make($row, [
                'full_name'               => ['required','string','max:100'],
                'identity_document'       => ['required','string','max:20'],
                'legal_guardian_contact'  => ['required','string','max:100'],
                'educational_institution' => ['required','string','max:100'],
                'department'              => ['required','string','max:50'],
                'school_grade'            => ['required','string','max:50'],
                'academic_tutor'          => ['nullable','string','max:100'],
            ]);

            if ($validator->fails()) {
                $errors[] = [
                    'linea'   => $line,
                    'errores' => $validator->errors()->all(),
                    'datos'   => $row,
                ];
            } else {
                $rows[] = [
                    'full_name'               => $row['full_name'],
                    'identity_document'       => $row['identity_document'],
                    'legal_guardian_contact'  => $row['legal_guardian_contact'],
                    'educational_institution' => $row['educational_institution'],
                    'department'              => $row['department'],
                    'school_grade'            => $row['school_grade'],
                    'academic_tutor'          => ($row['academic_tutor'] === '') ? null : $row['academic_tutor'],
                    'created_at'              => $now,
                    'updated_at'              => $now,
                ];
            }

            $line++;
        }

        return [$rows, $errors];
    }

    private function upsertWithMetrics(string $table, array $rows, array $uniqueBy, array $updateColumns): array
    {
        $inserted = 0; $updated = 0;

        DB::transaction(function () use ($table, $rows, $uniqueBy, $updateColumns, &$inserted, &$updated) {
            $before = DB::table($table)->count();

            if (!empty($rows)) {
                DB::table($table)->upsert($rows, $uniqueBy, $updateColumns);
            }

            $after = DB::table($table)->count();
            $inserted = max(0, $after - $before);
            $updated  = max(0, count($rows) - $inserted);
        });

        return [$inserted, $updated];
    }
}
