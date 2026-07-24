<?php

namespace App\Controllers;

use App\Utils\Response;

class HealthController
{
    public function index(): void
    {
        Response::json([
            'status' => 'healthy',
            'service' => $_ENV['APP_NAME'] ?? 'NETS Logistics REST API',
            'environment' => $_ENV['APP_ENV'] ?? 'development',
            'phpVersion' => PHP_VERSION,
            'serverTime' => date('Y-m-d H:i:s T'),
        ]);
    }
}
