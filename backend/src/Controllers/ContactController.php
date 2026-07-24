<?php

namespace App\Controllers;

use App\Services\ContactService;
use App\Utils\Response;

class ContactController
{
    /**
     * POST /api/v1/contact
     */
    public function store(): void
    {
        $rawInput = file_get_contents('php://input');
        $payload = json_decode($rawInput, true) ?? $_POST;

        try {
            $contact = ContactService::createContact($payload);
            Response::json([
                'message' => 'Your message has been received. Our team will get back to you shortly.',
                'contact' => $contact
            ], 201);
        } catch (\InvalidArgumentException $e) {
            Response::error($e->getMessage(), 422);
        } catch (\Throwable $e) {
            Response::error('Failed to submit contact message: ' . $e->getMessage(), 500);
        }
    }

    /**
     * GET /api/v1/contact
     */
    public function index(): void
    {
        try {
            $contacts = ContactService::getAllContacts();
            Response::json(['contacts' => $contacts]);
        } catch (\Throwable $e) {
            Response::error('Failed to fetch contact messages: ' . $e->getMessage(), 500);
        }
    }
}
