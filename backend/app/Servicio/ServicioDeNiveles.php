<?php
// app/Servicio/ServicioDeNiveles.php
require_once __DIR__.'/../repositorio/RepositorioDeNiveles.php';
require_once __DIR__.'/../validacion/ValidadorDeNivel.php';

final class ServicioDeNiveles {
  public function __construct(private RepositorioDeNiveles $repo) {}

  /** @return array<int, array{id:int,nombre:string,activo:bool}> */
  public function listar(string $busqueda = '', ?bool $soloActivos = null): array {
    return array_map(fn(Nivel $n)=>$n->aArreglo(), $this->repo->listar($busqueda, $soloActivos));
  }

  public function crear(string $nombre, bool $activo): int {
    ValidadorDeNivel::asegurarNombreObligatorio($nombre);          // CA5
    ValidadorDeNivel::asegurarNombreUnico($nombre, $this->repo);   // CA2/CA6
    return $this->repo->crear(trim($nombre), $activo);
  }

  public function actualizar(int $id, ?string $nombre, ?bool $activo): void {
    if ($nombre !== null) {
      ValidadorDeNivel::asegurarNombreObligatorio($nombre);        // CA5
      ValidadorDeNivel::asegurarNombreUnico($nombre, $this->repo, $id); // CA6
    }
    $this->repo->actualizar($id, $nombre?trim($nombre):null, $activo); // CA3/CA4
  }

  public function alternarActivo(int $id, bool $activo): void {
    $this->repo->actualizar($id, null, $activo);                    // CA4
  }

  public function eliminar(int $id): void { $this->repo->eliminar($id); }
}