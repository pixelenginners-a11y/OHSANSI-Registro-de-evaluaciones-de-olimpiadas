<?php

namespace App\Services;

class ImportResult
{
    public function __construct(
        public int $processed = 0,
        public int $inserted  = 0,
        public int $updated   = 0,
        public array $errors  = [],
        public bool $invalidHeader = false,
        public array $expected = [],
        public array $received = [],
        public ?string $openError = null,
    ) {}

    public static function fromInvalidHeader(array $expected, array $received): self
    {
        $i = new self();
        $i->invalidHeader = true;
        $i->expected = $expected;
        $i->received = $received;
        return $i;
    }

    public static function fromError(string $msg): self
    {
        $i = new self();
        $i->openError = $msg;
        // Tratamos como encabezado inválido para mantener respuesta 422 consistente
        $i->invalidHeader = true;
        $i->expected = [];
        $i->received = [];
        return $i;
    }
}
