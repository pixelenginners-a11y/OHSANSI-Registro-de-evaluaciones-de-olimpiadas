<?php
// app/Repositorio/RepositorioDeNiveles.php
require_once __DIR__.'/../infraestructura/BD.php';
require_once __DIR__.'/../dominio/Nivel.php';

final class RepositorioDeNiveles {

  /** @return Nivel[] */
  public function listar(string $busqueda = '', ?bool $soloActivos = null): array {
    $sql = "SELECT id,nombre,activo FROM niveles WHERE 1=1";
    $p = [];
    if ($busqueda !== '') { $sql .= " AND nombre ILIKE ?"; $p[] = "%$busqueda%"; }
    if ($soloActivos !== null) { $sql .= " AND activo = ?"; $p[] = $soloActivos; }
    $sql .= " ORDER BY nombre ASC";
    $st = BD::pdo()->prepare($sql); $st->execute($p);
    return array_map(fn($r)=>Nivel::desdeFila($r), $st->fetchAll());
  }

  public function existePorNombre(string $nombre, ?int $excluirId = null): bool {
    $sql = "SELECT 1 FROM niveles WHERE nombre = ?";
    $p = [$nombre];
    if ($excluirId) { $sql .= " AND id <> ?"; $p[] = $excluirId; }
    $st = BD::pdo()->prepare($sql); $st->execute($p);
    return (bool) $st->fetchColumn();
  }

  public function crear(string $nombre, bool $activo): int {
    $st = BD::pdo()->prepare("INSERT INTO niveles(nombre,activo) VALUES(?,?) RETURNING id");
    $st->execute([$nombre, $activo]);
    return (int)$st->fetchColumn();
  }

  public function actualizar(int $id, ?string $nombre, ?bool $activo): void {
    $sets = []; $p = [];
    if ($nombre !== null) { $sets[] = "nombre = ?"; $p[] = $nombre; }
    if ($activo !== null) { $sets[] = "activo = ?"; $p[] = $activo; }
    if (!$sets) return;
    $p[] = $id;
    $sql = "UPDATE niveles SET ".implode(',', $sets)." WHERE id = ?";
    BD::pdo()->prepare($sql)->execute($p);
  }

  public function eliminar(int $id): void {
    BD::pdo()->prepare("DELETE FROM niveles WHERE id=?")->execute([$id]);
  }

  public function buscarPorId(int $id): ?Nivel {
    $st = BD::pdo()->prepare("SELECT id,nombre,activo FROM niveles WHERE id=?");
    $st->execute([$id]);
    $r = $st->fetch();
    return $r ? Nivel::desdeFila($r) : null;
  }
}