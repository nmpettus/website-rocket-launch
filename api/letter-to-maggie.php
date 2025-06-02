<?php
require 'config.php';
require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Set headers for CORS and JSON response
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Only POST requests are allowed']);
    exit();
}

try {
    // Get POST data
    $postData = $_POST;
    
    // If JSON was sent instead of form data
    if (empty($postData)) {
        $jsonData = file_get_contents('php://input');
        $postData = json_decode($jsonData, true);
    }
    
    // Debug: Log the received data
    error_log("Letter to Maggie - Received data: " . print_r($postData, true));
    
    // Validate required fields
    if (empty($postData['from_name'])) {
        throw new Exception('Name is required');
    }
    
    if (empty($postData['message'])) {
        throw new Exception('Message is required');
    }
    
    // Set up PHPMailer
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = SMTP_HOST;
    $mail->SMTPAuth = true;
    $mail->Username = SMTP_USERNAME;
    $mail->Password = SMTP_PASSWORD;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = SMTP_PORT;
    
    // Sender
    $mail->setFrom(FROM_EMAIL, FROM_NAME);
    
    // Admin recipient
    $mail->addAddress(FROM_EMAIL);
    
    // If child's parent provided email, add as reply-to
    if (!empty($postData['sender_email']) && filter_var($postData['sender_email'], FILTER_VALIDATE_EMAIL)) {
        $mail->addReplyTo($postData['sender_email']);
    }
    
    // Email content
    $mail->Subject = 'New Letter to Maggie from ' . $postData['from_name'];
    
    // Build email body
    $emailBody = "Name: " . htmlspecialchars($postData['from_name']) . "\n";
    $emailBody .= "Email: " . htmlspecialchars($postData['sender_email'] ?? 'Not provided') . "\n\n";
    $emailBody .= "Message:\n" . htmlspecialchars($postData['message']);
    
    $mail->Body = $emailBody;
    
    // Send email
    $mail->send();
    
    // Return success response
    echo json_encode([
        'success' => true, 
        'message' => 'Letter sent successfully',
        'messageId' => 'letter_' . time()
    ]);
    
} catch (Exception $e) {
    // Log error (to server error log)
    error_log('Letter to Maggie Error: ' . $e->getMessage());
    
    // Return error response
    echo json_encode([
        'success' => false, 
        'message' => 'Failed to send letter: ' . $e->getMessage()
    ]);
}

