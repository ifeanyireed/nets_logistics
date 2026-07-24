<?php

namespace App\Utils;

class Cors
{
    /**
     * Handle CORS headers for preflight and standard requests.
     */
    public static function handle(): void
    {
        $allowedOriginsStr = $_ENV['CORS_ALLOWED_ORIGINS'] ?? 'http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173';
        $allowedOrigins = array_map('trim', explode(',', $allowedOriginsStr));

        $origin = $_SERVER['HTTP_ORIGIN'] ?? '*';

        if (in_array('*', $allowedOrigins) || in_array($origin, $allowedOrigins)) {
            header("Access-Control-Allow-Origin: " . ($origin === '*' ? '*' : $origin));
        } else {
            header("Access-Control-Allow-Origin: " . $allowedOrigins[0]);
        }

        header("Access-Control-Allow-Credentials: true");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
        header("Access-Control-Max-Age: 86400");

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit;
        }
    }
}
