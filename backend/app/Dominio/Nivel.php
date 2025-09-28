<?php
final class Nivel{
    public function _construct(public int $id,public string $nombre, public bool $activo){}
    public static function desdeFila(array $r): self{
        return new self((int)$r['id'],(string)$r['nombre'],(bool)$r['activo']);
    }
    public function toArray(): array{
        return ['id'=>$this->id,'nombre'=>$this->nombre,'activo'=>$this->activo];
    }
}