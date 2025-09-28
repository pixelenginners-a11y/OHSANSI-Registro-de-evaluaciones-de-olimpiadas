<?php
// app/Validacion/ValidadorDeNivel.php
require_once __DIR__.'/ExcepcionDeValidacion.php';
require_once __DIR__.'/../repositorio/RepositorioDeNiveles.php';

final class ValidadorDeNivel {
  public static function asegurarNombreObligatorio(?string $nombre): void {
    if ($nombre === null || trim($nombre) === '') {
      throw new ExcepcionDeValidacion('NOMBRE_OBLIGATORIO', 'El nombre del nivel es obligatorio');
    }
  }
  public static function asegurarNombreUnico(string $nombre, RepositorioDeNiveles $repo, ?int $excluirId=null): void {
    if ($repo->existePorNombre($nombre, $excluirId)) {
      throw new ExcepcionDeValidacion('NOMBRE_DUPLICADO', 'Ya existe un nivel con ese nombre');
    }
  }
}