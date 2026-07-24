<?php

require_once __DIR__ . '/../vendor/autoload.php';

// Load Environment Variables
if (file_exists(__DIR__ . '/../.env')) {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
    $dotenv->load();
}

// Handle CORS Preflight / Headers
\App\Utils\Cors::handle();

// Initialize Router
$router = new \Bramus\Router\Router();

// Define API Routes
$router->mount('/api/v1', function () use ($router) {
    // Health check
    $router->get('/health', '\App\Controllers\HealthController@index');

    // Leads / Quotations
    $router->post('/leads', '\App\Controllers\LeadController@store');
    $router->get('/leads', '\App\Controllers\LeadController@index');
    $router->get('/leads/([^/]+)', '\App\Controllers\LeadController@show');

    // Contact Inquiries
    $router->post('/contact', '\App\Controllers\ContactController@store');
    $router->get('/contact', '\App\Controllers\ContactController@index');

    // Fleet Vehicles Catalog
    $router->get('/vehicles', '\App\Controllers\VehicleController@index');
});

// Root Route
$router->get('/', function() {
    \App\Utils\Response::json([
        'message' => 'Welcome to NETS Logistics REST API',
        'documentation' => '/api/v1/health',
        'version' => '1.0.0'
    ]);
});

// 404 Handler
$router->set404(function () {
    \App\Utils\Response::error('Requested endpoint not found.', 404);
});

// Run Router
try {
    $router->run();
} catch (\Throwable $e) {
    \App\Utils\Response::error('Server Error: ' . $e->getMessage(), 500);
}
