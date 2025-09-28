<?php
// app/index.php
require_once __DIR__.'/infraestructura/BD.php';
require_once __DIR__.'/dominio/Nivel.php';
require_once __DIR__.'/repositorio/RepositorioDeNiveles.php';
require_once __DIR__.'/validacion/ExcepcionDeValidacion.php';
require_once __DIR__.'/validacion/ValidadorDeNivel.php';
require_once __DIR__.'/servicio/ServicioDeNiveles.php';
require_once __DIR__.'/controlador/ControladorDeNiveles.php';

$repo = new RepositorioDeNiveles();
$servicio = new ServicioDeNiveles($repo);
$controlador = new ControladorDeNiveles($servicio);

$metodo = $_SERVER['REQUEST_METHOD'];
$path = $_GET['ruta'] ?? '/niveles';

if ($path === '/niveles') { $controlador->procesar($metodo, $_GET); }
else { http_response_code(404); header('Content-Type: application/json'); echo json_encode(['error'=>'NO_ENCONTRADO']); }