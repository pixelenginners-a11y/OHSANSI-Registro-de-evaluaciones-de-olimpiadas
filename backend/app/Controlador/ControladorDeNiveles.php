<?php
// app/Controlador/ControladorDeNiveles.php
require_once __DIR__.'/../servicio/ServicioDeNiveles.php';
require_once __DIR__.'/../validacion/ExcepcionDeValidacion.php';

final class ControladorDeNiveles {
  public function __construct(private ServicioDeNiveles $servicio) {}

  public function procesar(string $metodo, array $query): void {
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');

    if ($metodo === 'OPTIONS') { http_response_code(204); return; }

    try {
      switch ($metodo) {
        case 'GET': {
          $q = $query['q'] ?? '';
          $soloActivos = isset($query['soloActivos']) ? (bool)$query['soloActivos'] : null;
          echo json_encode($this->servicio->listar($q, $soloActivos)); break;     // CA1/CA9/CA4
        }
        case 'POST': {
          $b = json_decode(file_get_contents('php://input'), true) ?: [];
          $id = $this->servicio->crear($b['nombre'] ?? '', (bool)($b['activo'] ?? true)); // CA2/CA5/CA6
          http_response_code(201); echo json_encode(['ok'=>true,'id'=>$id]); break;
        }
        case 'PUT': {
          $id = (int)($query['id'] ?? 0);
          $b = json_decode(file_get_contents('php://input'), true) ?: [];
          $this->servicio->actualizar($id, $b['nombre'] ?? null, isset($b['activo'])?(bool)$b['activo']:null); // CA3
          echo json_encode(['ok'=>true]); break;
        }
        case 'PATCH': {
          $id = (int)($query['id'] ?? 0);
          $b = json_decode(file_get_contents('php://input'), true) ?: [];
          $this->servicio->alternarActivo($id, (bool)($b['activo'] ?? true));     // CA4
          echo json_encode(['ok'=>true]); break;
        }
        case 'DELETE': {
          $id = (int)($query['id'] ?? 0);
          $this->servicio->eliminar($id);
          echo json_encode(['ok'=>true]); break;
        }
        default:
          http_response_code(405); echo json_encode(['error'=>'METODO_NO_PERMITIDO']);
      }
    } catch (ExcepcionDeValidacion $e) {
      http_response_code($e->codigo==='NOMBRE_DUPLICADO' ? 409 : 400);
      echo json_encode(['error'=>$e->codigo, 'mensaje'=>$e->getMessage()]);
    } catch (Throwable $t) {
      http_response_code(500); echo json_encode(['error'=>'ERROR_SERVIDOR']);
    }
  }
}