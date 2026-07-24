<?php

namespace App\Controllers;

use App\Services\VehicleService;
use App\Utils\Response;

class VehicleController
{
    /**
     * GET /api/v1/vehicles
     */
    public function index(): void
    {
        $vehicles = VehicleService::getVehicles();
        Response::json([
            'count' => count($vehicles),
            'vehicles' => $vehicles
        ]);
    }
}
