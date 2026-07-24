<?php

namespace App\Services;

use App\Database\Database;
use PDO;

class ContactService
{
    public static function createContact(array $data): array
    {
        $pdo = Database::getConnection();

        $name = trim($data['name'] ?? '');
        $email = trim($data['email'] ?? '');
        $phone = trim($data['phone'] ?? '');
        $subject = trim($data['subject'] ?? 'General Inquiry');
        $message = trim($data['message'] ?? '');

        if (empty($name) || empty($email) || empty($message)) {
            throw new \InvalidArgumentException('Name, email, and message are required.');
        }

        $stmt = $pdo->prepare("
            INSERT INTO contacts (name, email, phone, subject, message, created_at)
            VALUES (:name, :email, :phone, :subject, :message, datetime('now'))
        ");

        $stmt->execute([
            ':name' => $name,
            ':email' => $email,
            ':phone' => $phone,
            ':subject' => $subject,
            ':message' => $message,
        ]);

        $id = $pdo->lastInsertId();

        return [
            'id' => (int)$id,
            'name' => $name,
            'email' => $email,
            'subject' => $subject,
            'status' => 'unread',
            'createdAt' => date('c'),
        ];
    }

    public static function getAllContacts(int $limit = 50): array
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM contacts ORDER BY id DESC LIMIT :limit");
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll();
    }
}
