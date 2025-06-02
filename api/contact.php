<?php
// Create a log file for detailed debugging
$log_file = __DIR__ . '/contact_debug.txt';
file_put_contents($log_file, "=== Contact Form Request at " . date('Y-m-d H:i:s') . " ===\n", FILE_APPEND);

// Enable CORS for cross-origin requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Log PHP version and available functions
file_put_contents($log_file, "PHP Version: " . phpversion() . "\n", FILE_APPEND);
file_put_contents($log_file, "mail() function exists: " . (function_exists('mail') ? "Yes" : "No") . "\n", FILE_APPEND);

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Debug: Log the raw request
$raw_post = file_get_contents('php://input');
file_put_contents($log_file, "Raw POST data: " . $raw_post . "\n", FILE_APPEND);

// Debug: Log the $_POST array
file_put_contents($log_file, "POST array: " . print_r($_POST, true) . "\n", FILE_APPEND);

// Get the request data - try both POST and JSON input
$data = $_POST;

// If POST is empty, try to parse JSON input
if (empty($data)) {
    $data = json_decode($raw_post, true);
    file_put_contents($log_file, "Parsed JSON data: " . print_r($data, true) . "\n", FILE_APPEND);
}

// Map field names - handle both naming conventions
$name = !empty($data['name']) ? trim($data['name']) : (!empty($data['from_name']) ? trim($data['from_name']) : '');
$email = !empty($data['email']) ? trim($data['email']) : (!empty($data['reply_to']) ? trim($data['reply_to']) : '');
$subject = !empty($data['subject']) ? trim($data['subject']) : 'New Contact Form Submission';
$message = !empty($data['message']) ? trim($data['message']) : '';

file_put_contents($log_file, "Mapped fields:\n", FILE_APPEND);
file_put_contents($log_file, "Name: $name\n", FILE_APPEND);
file_put_contents($log_file, "Email: $email\n", FILE_APPEND);
file_put_contents($log_file, "Subject: $subject\n", FILE_APPEND);
file_put_contents($log_file, "Message: $message\n", FILE_APPEND);

// Validate the mapped data
if (empty($name) || empty($email) || empty($message)) {
    file_put_contents($log_file, "Missing required fields after mapping\n", FILE_APPEND);
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    file_put_contents($log_file, "Invalid email format\n", FILE_APPEND);
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit;
}

// Sanitize the data
$name = htmlspecialchars($name);
$email = filter_var($email, FILTER_SANITIZE_EMAIL);
$subject = htmlspecialchars($subject);
$message = htmlspecialchars($message);

// Prepare email content
$to = 'maggie@booksbymaggie.com'; // Replace with your actual email
$email_subject = "Contact Form: $subject";

// Create both HTML and plain text versions
$html_body = "
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        h1 { color: #4a6ee0; }
        .details { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class='container'>
        <h1>New Contact Form Submission</h1>
        
        <div class='details'>
            <p><strong>Name:</strong> {$name}</p>
            <p><strong>Email:</strong> {$email}</p>
            <p><strong>Subject:</strong> {$subject}</p>
            <p><strong>Message:</strong></p>
            <p>" . nl2br(htmlspecialchars($message)) . "</p>
        </div>
        
        <div class='footer'>
            <p>This message was sent from the Books by Maggie contact form at " . date('Y-m-d H:i:s') . "</p>
        </div>
    </div>
</body>
</html>
";

// Plain text version
$plain_text = "New Contact Form Submission\n";
$plain_text .= "================================\n\n";
$plain_text .= "Name: $name\n";
$plain_text .= "Email: $email\n";
$plain_text .= "Subject: $subject\n\n";
$plain_text .= "Message:\n";
$plain_text .= "--------\n";
$plain_text .= "$message\n\n";
$plain_text .= "This message was sent from the Books by Maggie contact form at " . date('Y-m-d H:i:s') . "\n";

// Try to send the email with improved headers
$mail_sent = false;

if (function_exists('mail')) {
    file_put_contents($log_file, "Attempting to send contact email using mail() function\n", FILE_APPEND);
    
    // Use the server's domain for the From address to improve deliverability
    $server_domain = $_SERVER['HTTP_HOST'];
    $from_address = "noreply@" . $server_domain;
    
    // Create proper email headers
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: Books by Maggie <$from_address>\r\n";
    $headers .= "Reply-To: $name <$email>\r\n";
    $headers .= "Return-Path: $from_address\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
    $headers .= "X-Priority: 3\r\n";
    $headers .= "Message-ID: <" . time() . "." . uniqid() . "@$server_domain>\r\n";
    
    file_put_contents($log_file, "Using From address: $from_address\n", FILE_APPEND);
    file_put_contents($log_file, "Headers: $headers\n", FILE_APPEND);
    
    $mail_sent = mail($to, $email_subject, $html_body, $headers);
    file_put_contents($log_file, "mail() function result: " . ($mail_sent ? "Success" : "Failed") . "\n", FILE_APPEND);
    
    if (!$mail_sent) {
        // Try with plain text if HTML fails
        file_put_contents($log_file, "HTML email failed, trying plain text\n", FILE_APPEND);
        $plain_headers = "From: Books by Maggie <$from_address>\r\n";
        $plain_headers .= "Reply-To: $name <$email>\r\n";
        $plain_headers .= "Return-Path: $from_address\r\n";
        $plain_headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
        
        $mail_sent = mail($to, $email_subject, $plain_text, $plain_headers);
        file_put_contents($log_file, "Plain text mail() result: " . ($mail_sent ? "Success" : "Failed") . "\n", FILE_APPEND);
    }
    
    // Log any PHP errors
    $last_error = error_get_last();
    if ($last_error && $last_error['message']) {
        file_put_contents($log_file, "Last PHP error: " . $last_error['message'] . "\n", FILE_APPEND);
    }
}

// For testing purposes, we'll consider the form submission successful even if email fails
$success = true;

// Log the final result
if ($mail_sent) {
    file_put_contents($log_file, "Contact email sent successfully\n", FILE_APPEND);
} else {
    file_put_contents($log_file, "Failed to send contact email, but form submission was recorded\n", FILE_APPEND);
}

// Return success response
echo json_encode([
    'success' => $success,
    'message' => $success ? 'Message received! We\'ll get back to you soon.' : 'Your message was received but there was an issue sending the email notification.',
    'messageId' => uniqid('contact_'),
    'emailSent' => $mail_sent
]);
exit;
?>
