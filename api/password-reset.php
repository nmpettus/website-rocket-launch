<?php
// Password reset email sender.
// Called ONLY by the Supabase edge function `send-password-reset`.
// Sends a branded HTML email with a large, high-contrast button.
//
// This file is independent of contact.php / newsletter.php / letter-to-maggie.php
// and does not modify or share state with them.

$log_file = __DIR__ . '/password_reset_debug.txt';
file_put_contents($log_file, "=== Password Reset Request at " . date('Y-m-d H:i:s') . " ===\n", FILE_APPEND);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-Reset-Secret");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// ---- Shared secret check ------------------------------------------------
// Set PASSWORD_RESET_API_SECRET to a long random string in api/config.php
// (add one line: define('PASSWORD_RESET_API_SECRET', 'your-long-random-string');)
// and configure the SAME value as an edge-function secret in Lovable.
require_once __DIR__ . '/config.php';

$provided = isset($_SERVER['HTTP_X_RESET_SECRET']) ? $_SERVER['HTTP_X_RESET_SECRET'] : '';
$expected = defined('PASSWORD_RESET_API_SECRET') ? PASSWORD_RESET_API_SECRET : '';

if (empty($expected) || !hash_equals($expected, $provided)) {
    file_put_contents($log_file, "Unauthorized request (bad or missing X-Reset-Secret)\n", FILE_APPEND);
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

// ---- Parse input --------------------------------------------------------
$raw_post = file_get_contents('php://input');
$data = json_decode($raw_post, true);
if (!is_array($data)) { $data = $_POST; }

$recipient = !empty($data['recipient_email']) ? trim($data['recipient_email']) : '';
$reset_link = !empty($data['reset_link']) ? trim($data['reset_link']) : '';
$user_name = !empty($data['user_name']) ? trim($data['user_name']) : '';

if (empty($recipient) || !filter_var($recipient, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid recipient email']);
    exit;
}
if (empty($reset_link)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing reset_link']);
    exit;
}

// Sanity check the link points at our domain / Supabase auth endpoint.
$link_host = parse_url($reset_link, PHP_URL_HOST);
$allowed_hosts = ['booksbymaggie.com', 'www.booksbymaggie.com'];
$is_allowed = false;
foreach ($allowed_hosts as $h) {
    if ($link_host === $h) { $is_allowed = true; break; }
}
// Also allow the Supabase auth verify host (subdomain of supabase.co).
if (!$is_allowed && $link_host && preg_match('/\.supabase\.co$/', $link_host)) {
    $is_allowed = true;
}
if (!$is_allowed) {
    file_put_contents($log_file, "Refused reset_link host: $link_host\n", FILE_APPEND);
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid reset link host']);
    exit;
}

$safe_name = htmlspecialchars($user_name, ENT_QUOTES, 'UTF-8');
$safe_link = htmlspecialchars($reset_link, ENT_QUOTES, 'UTF-8');
$greeting = !empty($safe_name) ? "Hi {$safe_name}," : "Hi there,";

// ---- Build the email ----------------------------------------------------
$subject = "Reset your Books by Maggie password";

$html_body = <<<HTML
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Reset your password</title>
</head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;box-shadow:0 4px 14px rgba(0,0,0,0.06);overflow:hidden;">
        <tr>
          <td style="background:#1e3a8a;padding:24px 32px;text-align:center;color:#ffffff;">
            <div style="font-size:22px;font-weight:700;letter-spacing:0.3px;">Books by Maggie</div>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 32px 8px 32px;">
            <h1 style="margin:0 0 16px 0;font-size:22px;color:#111827;">Reset your password</h1>
            <p style="margin:0 0 14px 0;font-size:16px;line-height:1.55;color:#374151;">{$greeting}</p>
            <p style="margin:0 0 14px 0;font-size:16px;line-height:1.55;color:#374151;">
              We received a request to reset the password for your Books by Maggie account.
              Click the button below to choose a new password. This link will expire soon for your security.
            </p>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:16px 32px 8px 32px;">
            <!-- Big, high-contrast button -->
            <a href="{$safe_link}"
               style="display:inline-block;background:#fbbf24;color:#111827;text-decoration:none;font-size:18px;font-weight:700;padding:16px 36px;border-radius:8px;border:2px solid #f59e0b;min-width:220px;text-align:center;">
              Reset My Password
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px 8px 32px;">
            <p style="margin:0 0 8px 0;font-size:14px;color:#6b7280;">
              If the button doesn't work, copy and paste this link into your browser:
            </p>
            <p style="margin:0 0 16px 0;font-size:13px;word-break:break-all;">
              <a href="{$safe_link}" style="color:#1d4ed8;">{$safe_link}</a>
            </p>
            <p style="margin:0 0 8px 0;font-size:14px;color:#6b7280;">
              Didn't request a password reset? You can safely ignore this email — your password will not change.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px 28px 32px;border-top:1px solid #e5e7eb;">
            <p style="margin:0;font-size:13px;color:#9ca3af;text-align:center;">
              &copy; Books by Maggie &middot; <a href="https://booksbymaggie.com" style="color:#9ca3af;text-decoration:underline;">booksbymaggie.com</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
HTML;

$plain_text  = "Reset your Books by Maggie password\n\n";
$plain_text .= "We received a request to reset your password.\n";
$plain_text .= "Open this link to choose a new password:\n\n";
$plain_text .= $reset_link . "\n\n";
$plain_text .= "If you did not request a password reset, you can safely ignore this email.\n";

// ---- Send via PHPMailer (same pattern as letter-to-maggie.php) ----------
$mail_sent = false;
$error_msg = '';

$phpmailer_path = __DIR__ . '/vendor/PHPMailer/src/';
if (file_exists($phpmailer_path . 'PHPMailer.php')) {
    require_once $phpmailer_path . 'PHPMailer.php';
    require_once $phpmailer_path . 'SMTP.php';
    require_once $phpmailer_path . 'Exception.php';

    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = defined('SMTP_HOST') ? SMTP_HOST : 'smtp.hostinger.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = defined('SMTP_USERNAME') ? SMTP_USERNAME : '';
        $mail->Password   = defined('SMTP_PASSWORD') ? SMTP_PASSWORD : '';
        $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = defined('SMTP_PORT') ? SMTP_PORT : 465;

        $from_email = defined('SMTP_USERNAME') ? SMTP_USERNAME : 'maggie@booksbymaggie.com';
        $mail->setFrom($from_email, 'Maggie');
        $mail->addReplyTo($from_email, 'Maggie');
        $mail->addAddress($recipient);

        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body    = $html_body;
        $mail->AltBody = $plain_text;

        $mail->send();
        $mail_sent = true;
        file_put_contents($log_file, "Password reset email sent to $recipient\n", FILE_APPEND);
    } catch (Exception $e) {
        $error_msg = $mail->ErrorInfo ?: $e->getMessage();
        file_put_contents($log_file, "PHPMailer error: $error_msg\n", FILE_APPEND);
    }
} else {
    $error_msg = 'PHPMailer not installed';
    file_put_contents($log_file, "PHPMailer missing at $phpmailer_path\n", FILE_APPEND);
}

if ($mail_sent) {
    echo json_encode(['success' => true, 'message' => 'Password reset email sent']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to send email', 'error' => $error_msg]);
}
exit;
