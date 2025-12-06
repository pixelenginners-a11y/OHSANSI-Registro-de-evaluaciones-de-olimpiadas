<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\RankedService;

class GenerateRankingCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ranked:generate {--area= : ID del área específica (opcional)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generar ranking automáticamente para la olimpiada vigente';

    /**
     * Execute the console command.
     */
    public function handle(RankedService $rankedService)
    {
        $this->info('Iniciando generación de ranking...');

        $areaId = $this->option('area');

        if ($areaId) {
            $this->info("Generando ranking para área ID: {$areaId}");
        } else {
            $this->info('Generando ranking para todas las áreas');
        }

        $result = $rankedService->generateRanking($areaId);

        if ($result['success']) {
            $this->info('✓ ' . $result['message']);
            $this->info("Registros creados: {$result['records_created']}");
            $this->info("Olimpiada: {$result['olimpiada_nombre']} (ID: {$result['olimpiada_id']})");
            $this->info("Fase: {$result['phase']}");
        } else {
            $this->error('✗ ' . $result['message']);
            if (isset($result['error'])) {
                $this->error('Error: ' . $result['error']);
            }
            return 1;
        }

        return 0;
    }
}
