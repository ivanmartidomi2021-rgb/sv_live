<?php
/**
 * SV LIFE — Proxy opcional para Gemini API
 * ------------------------------------------------------------
 * Úsalo si NO quieres que la clave de Gemini quede guardada en
 * el navegador del usuario. Ideal para hosting compartido con
 * Apache + PHP (cPanel, etc.), que es lo más común al subir un
 * sitio a un dominio propio.
 *
 * CONFIGURACIÓN:
 * 1. Copia .env.example a .env (o define la variable de entorno
 *    GEMINI_API_KEY en el panel de tu hosting) y coloca tu clave.
 * 2. Sube esta carpeta /backend a tu servidor (fuera de la raíz
 *    pública si es posible, o protegida).
 * 3. En js/config.js, pon:
 *      BACKEND_URL: "https://tu-dominio.com/backend"
 *    y deja el campo de clave de Gemini vacío en Ajustes.
 *
 * Este archivo NO debe subirse a un repositorio público con tu
 * clave real dentro. La clave se lee de una variable de entorno.
 */

header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *"); // Ajusta a tu dominio en producción
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Carga simple de .env (opcional, sin dependencias externas)
function loadEnv($path) {
    if (!file_exists($path)) return;
    foreach (file($path, FILE_IGNORE_NEW_LINES) as $line) {
        if (strpos(trim($line), '#') === 0 || strpos($line, '=') === false) continue;
        list($k, $v) = explode('=', $line, 2);
        putenv(trim($k) . '=' . trim($v));
    }
}
loadEnv(__DIR__ . '/.env');

$apiKey = getenv('GEMINI_API_KEY');
if (!$apiKey) {
    http_response_code(500);
    echo json_encode(["error" => "GEMINI_API_KEY no configurada en el servidor."]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$message = trim($input['message'] ?? '');
$history = $input['history'] ?? [];

if ($message === '') {
    http_response_code(400);
    echo json_encode(["error" => "Falta el mensaje."]);
    exit;
}

$systemPrompt = "Eres SV AI, el asistente de la app SV Life para la vida cotidiana en El Salvador. " .
    "Responde SIEMPRE en español, con contexto salvadoreño. NUNCA inventes información legal, " .
    "gubernamental, de trámites o de emergencia; si no estás seguro, dilo y recomienda verificar " .
    "en la fuente oficial correspondiente. Sé breve y práctico.";

$contents = [];
foreach ($history as $m) {
    $role = ($m['role'] ?? 'user') === 'user' ? 'user' : 'model';
    $contents[] = ["role" => $role, "parts" => [["text" => $m['text'] ?? '']]];
}
$contents[] = ["role" => "user", "parts" => [["text" => $message]]];

$model = getenv('GEMINI_MODEL') ?: 'gemini-2.0-flash';
$url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}";

$body = json_encode([
    "system_instruction" => ["parts" => [["text" => $systemPrompt]]],
    "contents" => $contents
]);

$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => ["Content-Type: application/json"],
    CURLOPT_POSTFIELDS => $body,
    CURLOPT_TIMEOUT => 20
]);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if (!$response || $httpCode >= 400) {
    http_response_code(502);
    echo json_encode(["error" => "No se pudo contactar a Gemini.", "detail" => $response]);
    exit;
}

$data = json_decode($response, true);
$reply = $data['candidates'][0]['content']['parts'][0]['text'] ?? "No obtuve respuesta, intenta de nuevo.";

echo json_encode(["reply" => $reply]);
