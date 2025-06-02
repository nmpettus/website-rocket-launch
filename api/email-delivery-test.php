<?php
// Test different email delivery methods and configurations

$log_file = __DIR__ . '/email_delivery_test.txt';
file_put_contents($log_file, "=== Email Delivery Test at " . date('Y-m-d H:i:s') . " ===\n", FILE_APPEND);

function log_message($message) {
    global $log_file;
    file_put_contents($log_file, $message . "\n", FILE_APPEND);
    echo $message . "<br>";
}

// Test 1: Basic mail() with minimal headers
log_message("Test 1: Basic mail() function");
$to = 'maggie@booksbymaggie.com';
$subject = 'Test 1: Basic Email Test';
$message = 'This is a basic test email sent at ' . date('Y-m-d H:i:s');
$headers = 'From: webmaster@' . $_SERVER['HTTP_HOST'];

$result1 = mail($to, $subject, $message, $headers);
log_message("Basic mail() result: " . ($result1 ? "Success" : "Failed"));

// Test 2: mail() with proper headers
log_message("Test 2: mail() with proper headers");
$subject2 = 'Test 2: Proper Headers Email Test';
$message2 = 'This is a test email with proper headers sent at ' . date('Y-m-d H:i:s');
$headers2 = "From: Books by Maggie <noreply@" . $_SERVER['HTTP_HOST'] . ">\r\n";
$headers2 .= "Reply-To: maggie@booksbymaggie.com\r\n";
$headers2 .= "Return-Path: noreply@" . $_SERVER['HTTP_HOST'] . "\r\n";
$headers2 .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers2 .= "MIME-Version: 1.0\r\n";
$headers2 .= "Content-Type: text/plain; charset=UTF-8\r\n";

$result2 = mail($to, $subject2, $message2, $headers2);
log_message("Proper headers mail() result: " . ($result2 ? "Success" : "Failed"));

// Test 3: HTML email with proper headers
log_message("Test 3: HTML email");
$subject3 = 'Test 3: HTML Email Test';
$message3 = '
<html>
<head>
    <title>HTML Test Email</title>
</head>
<body>
    <h1>HTML Test Email</h1>
    <p>This is an <strong>HTML test email</strong> sent at ' . date('Y-m-d H:i:s') . '</p>
    <p>If you can see this formatted text, HTML emails are working.</p>
</body>
</html>
';
$headers3 = "From: Books by Maggie <noreply@" . $_SERVER['HTTP_HOST'] . ">\r\n";
$headers3 .= "Reply-To: maggie@booksbymaggie.com\r\n";
$headers3 .= "Return-Path: noreply@" . $_SERVER['HTTP_HOST'] . "\r\n";
$headers3 .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers3 .= "MIME-Version: 1.0\r\n";
$headers3 .= "Content-Type: text/html; charset=UTF-8\r\n";

$result3 = mail($to, $subject3, $message3, $headers3);
log_message("HTML mail() result: " . ($result3 ? "Success" : "Failed"));

// Test 4: Check server configuration
log_message("Server Configuration:");
log_message("Server: " . $_SERVER['SERVER_SOFTWARE']);
log_message("PHP Version: " . phpversion());
log_message("Host: " . $_SERVER['HTTP_HOST']);
log_message("Document Root: " . $_SERVER['DOCUMENT_ROOT']);

// Check if sendmail is available
$sendmail_path = ini_get('sendmail_path');
log_message("Sendmail Path: " . ($sendmail_path ? $sendmail_path : "Not set"));

// Check mail configuration
log_message("SMTP: " . ini_get('SMTP'));
log_message("smtp_port: " . ini_get('smtp_port'));
log_message("sendmail_from: " . ini_get('sendmail_from'));

log_message("All tests completed. Check your email inbox and spam folder.");
log_message("If no emails arrive, the server's mail configuration may need attention.");
?>
