<?php

namespace App\Controllers;

use App\Services\LeadService;
use App\Utils\Response;

class LeadController
{
    /**
     * POST /api/v1/leads
     */
    public function store(): void
    {
        $rawInput = file_get_contents('php://input');
        $payload = json_decode($rawInput, true);

        if (!$payload || !is_array($payload)) {
            Response::error('Invalid JSON payload provided.', 400);
            return;
        }

        try {
            $lead = LeadService::createLead($payload);
            Response::json([
                'message' => 'Lead created successfully',
                'lead' => $lead
            ], 201);
        } catch (\Throwable $e) {
            Response::error('Failed to create lead: ' . $e->getMessage(), 500);
        }
    }

    /**
     * GET /api/v1/leads
     */
    public function index(): void
    {
        try {
            $leads = LeadService::getAllLeads();
            Response::json(['leads' => $leads]);
        } catch (\Throwable $e) {
            Response::error('Failed to fetch leads: ' . $e->getMessage(), 500);
        }
    }

    /**
     * GET /api/v1/leads/{id}
     */
    public function show(string $id): void
    {
        try {
            $lead = LeadService::getLead($id);
            if (!$lead) {
                Response::error('Lead not found.', 404);
                return;
            }
            Response::json(['lead' => $lead]);
        } catch (\Throwable $e) {
            Response::error('Error retrieving lead: ' . $e->getMessage(), 500);
        }
    }
}
