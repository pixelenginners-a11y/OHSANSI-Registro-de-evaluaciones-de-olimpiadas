<?php
// app/Validacion/ExcepcionDeValidacion.php
final class ExcepcionDeValidacion extends RuntimeException {
  public string $codigo;
  public function __construct(string $codigo, string $mensaje) {
    parent::__construct($mensaje);
    $this->codigo = $codigo;
  }
}