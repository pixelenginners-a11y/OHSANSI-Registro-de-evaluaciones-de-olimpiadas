<?php
// app/db.php
header('Content-Type: application/json; charset=utf-8');

function pdo(): PDO {
  static $pdo = null;
  if ($pdo) return $pdo;

  $host = 'localhost';
  $db   = 'olimpiadas';
  $user = 'postgres';
  $pass = 'tu_password';
  $port = '5432';

  $dsn = "pgsql:host=$host;port=$port;dbname=$db;";

  $pdo = new PDO($dsn, $user, $pass, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
  ]);
  return $pdo;
}

function json_body(): array {
  $raw = file_get_contents('php://input');
  return $raw ? (json_decode($raw, true) ?? []) : [];
}

function http_json(int $code, $payload) {
  http_response_code($code);
  echo json_encode($payload);
  exit;
}
