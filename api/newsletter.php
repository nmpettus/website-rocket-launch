<?php
// Create a log file for detailed debugging
$log_file = __DIR__ . '/newsletter_debug.txt';
file_put_contents($log_file, "=== Newsletter Request at " . date('Y-m-d H:i:s') . " ===\n", FILE_APPEND);

// Enable CORS for all origins
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
    echo json_encode(['success' => false, 'message' => 'Only POST requests are allowed']);
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
if (empty($data) || empty($data['email'])) {
    $data = json_decode($raw_post, true);
    file_put_contents($log_file, "Parsed JSON data: " . print_r($data, true) . "\n", FILE_APPEND);
}

// Check if email field is present
if (empty($data) || empty($data['email'])) {
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'message' => 'Missing email field']);
    exit;
}

// Sanitize the email address
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
file_put_contents($log_file, "Sanitized email: " . $email . "\n", FILE_APPEND);

// Validate the email address
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit;
}

// Check if force_new flag is set
$force_new = isset($data['force_new']) && ($data['force_new'] === 'true' || $data['force_new'] === true);
file_put_contents($log_file, "Force new subscription: " . ($force_new ? "Yes" : "No") . "\n", FILE_APPEND);

// Path to subscribers file
$subscribers_file = __DIR__ . '/subscribers.txt';
file_put_contents($log_file, "Subscribers file path: " . $subscribers_file . "\n", FILE_APPEND);
file_put_contents($log_file, "Subscribers file exists: " . (file_exists($subscribers_file) ? "Yes" : "No") . "\n", FILE_APPEND);

// Create the file if it doesn't exist
if (!file_exists($subscribers_file)) {
    file_put_contents($subscribers_file, "");
    file_put_contents($log_file, "Created new subscribers file\n", FILE_APPEND);
}

file_put_contents($log_file, "Subscribers file is writable: " . (is_writable($subscribers_file) ? "Yes" : "No") . "\n", FILE_APPEND);

try {
    // Check if the email is already subscribed (skip if force_new is true)
    if (!$force_new && file_exists($subscribers_file)) {
        $subscribers = file($subscribers_file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        file_put_contents($log_file, "Current subscribers: " . print_r($subscribers, true) . "\n", FILE_APPEND);
        
        if (in_array($email, $subscribers)) {
            file_put_contents($log_file, "Email already subscribed\n", FILE_APPEND);
            echo json_encode([
                'success' => false,
                'message' => 'This email is already subscribed'
            ]);
            exit;
        }
    }

    // Add the email to the subscribers file
    $result = file_put_contents($subscribers_file, $email . PHP_EOL, FILE_APPEND | LOCK_EX);
    file_put_contents($log_file, "Write result: " . ($result !== false ? "Success" : "Failed") . "\n", FILE_APPEND);
    
    if ($result === false) {
        throw new Exception("Failed to write to subscribers file");
    }

    // Log success
    file_put_contents($log_file, "Successfully added email to subscribers: $email\n", FILE_APPEND);
    
    // Send notification email to admin using basic mail() function
    $to = 'maggie@booksbymaggie.com'; // Replace with your actual email
    $subject = 'New Newsletter Subscriber';
    
    $message = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            h1 { color: #4a6ee0; }
            .details { background-color: #f9f9f9; padding: 15px; border-radius: 5px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <h1>New Newsletter Subscriber!</h1>
            <p>Someone has just subscribed to the Books by Maggie newsletter.</p>
            
            <div class='details'>
                <p><strong>Email:</strong> {$email}</p>
                <p><strong>Date:</strong> " . date('F j, Y, g:i a') . "</p>
            </div>
            
            <p>You can view all subscribers in the subscribers.txt file.</p>
        </div>
    </body>
    </html>
    ";
    
    // To send HTML mail, the Content-type header must be set
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: Books by Maggie <noreply@booksbymaggie.com>" . "\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
    
    // Try to send the notification email
    $mail_sent = false;
    
    // First try with mail() function
    if (function_exists('mail')) {
        file_put_contents($log_file, "Attempting to send notification email using mail() function\n", FILE_APPEND);
        $mail_sent = mail($to, $subject, $message, $headers);
        file_put_contents($log_file, "mail() function result: " . ($mail_sent ? "Success" : "Failed") . "\n", FILE_APPEND);
    }
    
    // Return success response
    file_put_contents($log_file, "Returning success response\n", FILE_APPEND);
    echo json_encode([
        'success' => true,
        'message' => 'Subscription successful',
        'messageId' => uniqid('newsletter_'),
        'emailSent' => $mail_sent
    ]);
    exit;

} catch (Exception $e) {
    // Log the error
    file_put_contents($log_file, "Error processing subscription: " . $e->getMessage() . "\n", FILE_APPEND);

    // Return error response
    echo json_encode([
        'success' => false,
        'message' => 'Failed to process subscription: ' . $e->getMessage()
    ]);
    exit;
}
?>
