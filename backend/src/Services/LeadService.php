<?php

namespace App\Services;

use App\Database\Database;
use PDO;

class LeadService
{
    /**
     * Create a new lead from quotation payload.
     */
    public static function createLead(array $payload): array
    {
        $pdo = Database::getConnection();

        $reference = 'NETS-LEAD-' . strtoupper(substr(uniqid(), -6));
        
        $cust = $payload['customerInformation'] ?? [];
        $journey = $payload['journeyInformation'] ?? [];
        $invest = $payload['estimatedInvestment'] ?? [];

        $customerName = $cust['name'] ?? 'Unknown';
        $customerEmail = $cust['email'] ?? '';
        $customerPhone = $cust['phone'] ?? '';
        $company = $cust['company'] ?? '';

        $journeyType = $journey['journeyType'] ?? 'One-Way';
        $origin = $journey['pickupLocation'] ?? ($journey['pickupState'] ?? '');
        $destination = $journey['destinationLocation'] ?? ($journey['destinationState'] ?? '');

        $minEst = (float)($invest['minimumEstimate'] ?? 0);
        $maxEst = (float)($invest['maximumEstimate'] ?? 0);

        $jsonPayload = json_encode($payload, JSON_UNESCAPED_SLASHES);

        $stmt = $pdo->prepare("
            INSERT INTO leads (
                lead_reference, customer_name, customer_email, customer_phone,
                company, journey_type, origin, destination,
                estimated_investment_min, estimated_investment_max, payload_json, created_at
            ) VALUES (
                :ref, :name, :email, :phone,
                :company, :jtype, :origin, :dest,
                :min_est, :max_est, :json, datetime('now')
            )
        ");

        $stmt->execute([
            ':ref' => $reference,
            ':name' => $customerName,
            ':email' => $customerEmail,
            ':phone' => $customerPhone,
            ':company' => $company,
            ':jtype' => $journeyType,
            ':origin' => $origin,
            ':dest' => $destination,
            ':min_est' => $minEst,
            ':max_est' => $maxEst,
            ':json' => $jsonPayload,
        ]);

        $id = $pdo->lastInsertId();

        return [
            'id' => (int)$id,
            'leadId' => $reference,
            'leadReference' => $reference,
            'status' => 'pending',
            'customerName' => $customerName,
            'customerEmail' => $customerEmail,
            'createdAt' => date('c'),
        ];
    }

    /**
     * Get all leads.
     */
    public static function getAllLeads(int $limit = 50): array
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT id, lead_reference, customer_name, customer_email, customer_phone, company, journey_type, origin, destination, estimated_investment_min, estimated_investment_max, status, created_at FROM leads ORDER BY id DESC LIMIT :limit");
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt->fetchAll();
    }

    /**
     * Get a specific lead by ID or reference.
     */
    public static function getLead(string $identifier): ?array
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM leads WHERE id = :id OR lead_reference = :ref");
        $stmt->execute([':id' => $identifier, ':ref' => $identifier]);
        $result = $stmt->fetch();

        if ($result && isset($result['payload_json'])) {
            $result['payload'] = json_decode($result['payload_json'], true);
        }

        return $result ?: null;
    }
}
