<?php
//app/levels.php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD']==='OPTIONS'){ http_response_code(204); exit; }

require __DIR__ . '/db.php';
$pdo = pdo();

$method = $_SERVER['REQUEST_METHOD'];
$q = $_GET['q'] ?? '';
$onlyActive = isset($_GET['onlyActive']) && $_GET['onlyActive'] === '1';

try {
  switch ($method) {
    case 'GET': // CA1 + CA9 (+ CA4 para onlyActive)
      if ($onlyActive) {
        $stmt = $pdo->prepare("SELECT id, name, is_active FROM levels WHERE is_active = TRUE AND name ILIKE :q ORDER BY name");
      } else {
        $stmt = $pdo->prepare("SELECT id, name, is_active FROM levels WHERE name ILIKE :q ORDER BY name");
      }
      $stmt->execute([':q' => "%$q%"]);
      http_json(200, $stmt->fetchAll());
      break;

    case 'POST': // CA2, CA5, CA6, CA10
      $b = json_body();
      $name = trim($b['name'] ?? '');
      $active = isset($b['is_active']) ? (bool)$b['is_active'] : true;

      if ($name === '') http_json(400, ['error'=>'NAME_REQUIRED']);   // CA5

      // duplicado (si no usas citext cambia a LOWER(name)=LOWER(:name))
      $du = $pdo->prepare("SELECT 1 FROM levels WHERE name = :name");
      $du->execute([':name'=>$name]);
      if ($du->fetch()) http_json(409, ['error'=>'DUPLICATE_NAME']);  // CA2/CA6

      $ins = $pdo->prepare("INSERT INTO levels (name, is_active) VALUES (:name, :act) RETURNING id");
      $ins->execute([':name'=>$name, ':act'=>$active]);
      $id = (int)$ins->fetchColumn();
      http_json(201, ['ok'=>true, 'id'=>$id]);
      break;

    case 'PUT': // CA3, CA5, CA6, CA10
      parse_str($_SERVER['QUERY_STRING'] ?? '', $qs);
      $id = isset($qs['id']) ? (int)$qs['id'] : 0;
      if ($id<=0) http_json(400, ['error'=>'INVALID_ID']);
      $b = json_body();
      $name = array_key_exists('name', $b) ? trim((string)$b['name']) : null;
      $active = array_key_exists('is_active', $b) ? (bool)$b['is_active'] : null;

      if ($name !== null && $name==='') http_json(400, ['error'=>'NAME_REQUIRED']); // CA5
      if ($name !== null) {
        $du = $pdo->prepare("SELECT 1 FROM levels WHERE name = :name AND id <> :id");
        $du->execute([':name'=>$name, ':id'=>$id]);
        if ($du->fetch()) http_json(409, ['error'=>'DUPLICATE_NAME']); // CA6
      }

      $sets = []; $params = [':id'=>$id];
      if ($name !== null) { $sets[]="name=:name"; $params[':name']=$name; }
      if ($active !== null) { $sets[]="is_active=:act"; $params[':act']=$active; }
      if (!$sets) http_json(200, ['ok'=>true]);

      $sql = "UPDATE levels SET ".implode(',', $sets)." WHERE id=:id";
      $pdo->prepare($sql)->execute($params);
      http_json(200, ['ok'=>true]);
      break;

    case 'PATCH': // CA4, CA8, CA10  (el front pide confirmación)
      parse_str($_SERVER['QUERY_STRING'] ?? '', $qs);
      $id = isset($qs['id']) ? (int)$qs['id'] : 0;
      $b = json_body();
      $active = (bool)($b['is_active'] ?? true);
      $pdo->prepare("UPDATE levels SET is_active=:a WHERE id=:id")->execute([':a'=>$active, ':id'=>$id]);
      http_json(200, ['ok'=>true]);
      break;

    case 'DELETE': // opcional
      parse_str($_SERVER['QUERY_STRING'] ?? '', $qs);
      $id = isset($qs['id']) ? (int)$qs['id'] : 0;
      $pdo->prepare("DELETE FROM levels WHERE id=:id")->execute([':id'=>$id]);
      http_json(200, ['ok'=>true]);
      break;

    default:
      http_json(405, ['error'=>'METHOD_NOT_ALLOWED']);
  }
} catch (PDOException $e) {
  // 23505 = unique_violation en Postgres
  if ($e->getCode()==='23505') http_json(409, ['error'=>'DUPLICATE_NAME']);
  http_json(500, ['error'=>'SERVER_ERROR','detail'=>$e->getCode()]);
}
