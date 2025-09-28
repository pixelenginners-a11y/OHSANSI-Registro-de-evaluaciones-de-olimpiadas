<?php
// app/Infraestructura/BD.php
final class BD {
  private static ?PDO $pdo = null;
  public static function pdo(): PDO {
    if (!self::$pdo) {
      $dsn = "pgsql:host=localhost;port=5432;dbname=olimpiadas";
      self::$pdo = new PDO($dsn, "usuario", "clave", [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
      ]);
    }
    return self::$pdo;
  }
}
