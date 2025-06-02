<?php
// Set error reporting for maximum debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: text/html; charset=UTF-8");
?>
<!DOCTYPE html>
<html>
<head>
    <title>Email System Diagnostics</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; max-width: 800px; margin: 0 auto; }
        h1 { color: #4a6ee0; }
        h2 { color: #333; margin-top: 30px; }
        .success { color: green; font-weight: bold; }
        .error { color: red; font-weight: bold; }
        .warning { color: orange; font-weight: bold; }
        pre { background: #f5f5f5; padding: 10px; overflow: auto; }
        .test-section { border: 1px solid #ddd; padding: 15px; margin-bottom: 20px; border-radius: 5px; }
    </style>
</head>
<body>
    <h1>Email System Diagnostics</h1>
    <p>This script will help diagnose issues with the email functionality on your website.</p>

    <div class="test-section">
        <h2>1. PHP Version and Extensions</h2>
        <?php
        echo "<p>PHP Version: <b>" . phpversion() . "</b></p>";
        
        $required_extensions = ['openssl', 'mbstring', 'json', 'curl'];
        echo "<p>Required Extensions:</p><ul>";
        foreach ($required_extensions as $ext) {
            if (extension_loaded($ext)) {
                echo "<li class='success'>$ext: Loaded</li>";
            } else {
                echo "<li class='error'>$ext: Not loaded</li>";
            }
        }
        echo "</ul>";
        ?>
    </div>

    <div class="test-section">
        <h2>2. Configuration Files</h2>
        <?php
        $config_file = __DIR__ . '/config.php';
        if (file_exists($config_file)) {
            echo "<p class='success'>config.php exists</p>";
            
            // Check if we can include it without errors
            try {
                include_once $config_file;
                echo "<p>Checking SMTP configuration:</p><ul>";
                
                if (defined('SMTP_HOST')) echo "<li>SMTP_HOST: " . SMTP_HOST . "</li>";
                else echo "<li class='error'>SMTP_HOST: Not defined</li>";
                
                if (defined('SMTP_USERNAME')) echo "<li>SMTP_USERNAME: " . SMTP_USERNAME . "</li>";
                else echo "<li class='error'>SMTP_USERNAME: Not defined</li>";
                
                if (defined('SMTP_PASSWORD')) echo "<li>SMTP_PASSWORD: " . (defined('SMTP_PASSWORD') ? "Defined (hidden)" : "Not defined") . "</li>";
                else echo "<li class='error'>SMTP_PASSWORD: Not defined</li>";
                
                if (defined('SMTP_PORT')) echo "<li>SMTP_PORT: " . SMTP_PORT . "</li>";
                else echo "<li class='error'>SMTP_PORT: Not defined</li>";
                
                if (defined('FROM_EMAIL')) echo "<li>FROM_EMAIL: " . FROM_EMAIL . "</li>";
                else echo "<li class='error'>FROM_EMAIL: Not defined</li>";
                
                if (defined('FROM_NAME')) echo "<li>FROM_NAME: " . FROM_NAME . "</li>";
                else echo "<li class='error'>FROM_NAME: Not defined</li>";
                
                echo "</ul>";
            } catch (Exception $e) {
                echo "<p class='error'>Error including config.php: " . $e->getMessage() . "</p>";
            }
        } else {
            echo "<p class='error'>config.php does not exist at: $config_file</p>";
        }
        ?>
    </div>

    <div class="test-section">
        <h2>3. PHPMailer Availability</h2>
        <?php
        $autoload_file = __DIR__ . '/vendor/autoload.php';
        if (file_exists($autoload_file)) {
            echo "<p class='success'>vendor/autoload.php exists</p>";
            
            try {
                require_once $autoload_file;
                if (class_exists('PHPMailer\PHPMailer\PHPMailer')) {
                    echo "<p class='success'>PHPMailer class is available</p>";
                } else {
                    echo "<p class='error'>PHPMailer class is not available. You may need to run 'composer require phpmailer/phpmailer'</p>";
                }
            } catch (Exception $e) {
                echo "<p class='error'>Error loading autoload.php: " . $e->getMessage() . "</p>";
            }
        } else {
            echo "<p class='error'>vendor/autoload.php does not exist at: $autoload_file</p>";
            echo "<p>You may need to run 'composer require phpmailer/phpmailer' in your api directory</p>";
        }
        ?>
    </div>

    <div class="test-section">
        <h2>4. File Permissions</h2>
        <?php
        $files_to_check = [
            __DIR__ . '/subscribers.txt',
            __DIR__ . '/contact_log.txt',
            __DIR__
        ];
        
        echo "<ul>";
        foreach ($files_to_check as $file) {
            if (file_exists($file)) {
                $perms = substr(sprintf('%o', fileperms($file)), -4);
                $writable = is_writable($file);
                $status = $writable ? 'success' : 'error';
                $type = is_dir($file) ? 'Directory' : 'File';
                echo "<li class='$status'>$type: " . basename($file) . " (Permissions: $perms, Writable: " . ($writable ? 'Yes' : 'No') . ")</li>";
            } else {
                echo "<li class='warning'>Not found: " . basename($file) . "</li>";
            }
        }
        echo "</ul>";
        ?>
    </div>

    <div class="test-section">
        <h2>5. Test Basic PHP Mail Function</h2>
        <?php
        if (function_exists('mail')) {
            echo "<p class='success'>PHP mail() function exists</p>";
            
            // Only run the test if requested
            if (isset($_GET['test_mail'])) {
                $to = isset($_GET['email']) ? $_GET['email'] : (defined('FROM_EMAIL') ? FROM_EMAIL : 'test@example.com');
                $subject = 'Test Email from Books by Maggie';
                $message = 'This is a test email sent from the diagnostics script at ' . date('Y-m-d H:i:s');
                $headers = 'From: ' . (defined('FROM_EMAIL') ? FROM_EMAIL : 'test@example.com');
                
                $result = mail($to, $subject, $message, $headers);
                
                if ($result) {
                    echo "<p class='success'>Test email sent to $to. Please check your inbox and spam folder.</p>";
                } else {
                    echo "<p class='error'>Failed to send test email using mail() function.</p>";
                }
            } else {
                echo "<form method='get'>";
                echo "<input type='hidden' name='test_mail' value='1'>";
                echo "<p>Email address to test: <input type='email' name='email' value='" . (defined('FROM_EMAIL') ? FROM_EMAIL : '') . "' required></p>";
                echo "<p><button type='submit'>Send Test Email</button></p>";
                echo "</form>";
            }
        } else {
            echo "<p class='error'>PHP mail() function is not available on this server</p>";
        }
        ?>
    </div>

    <div class="test-section">
        <h2>6. Test PHPMailer</h2>
        <?php
        if (class_exists('PHPMailer\PHPMailer\PHPMailer')) {
            echo "<p class='success'>PHPMailer class is available</p>";
            
            // Only run the test if requested
            if (isset($_GET['test_phpmailer'])) {
                try {
                    require_once __DIR__ . '/vendor/autoload.php';
                    require_once __DIR__ . '/config.php';
                    
                    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
                    
                    // Server settings
                    $mail->SMTPDebug = 2; // Enable verbose debug output
                    $mail->isSMTP();
                    $mail->Host = SMTP_HOST;
                    $mail->SMTPAuth = true;
                    $mail->Username = SMTP_USERNAME;
                    $mail->Password = SMTP_PASSWORD;
                    $mail->SMTPSecure = 'tls';
                    $mail->Port = SMTP_PORT;
                    
                    // Recipients
                    $mail->setFrom(FROM_EMAIL, FROM_NAME);
                    $to = isset($_GET['phpmailer_email']) ? $_GET['phpmailer_email'] : FROM_EMAIL;
                    $mail->addAddress($to);
                    
                    // Content
                    $mail->isHTML(true);
                    $mail->Subject = 'PHPMailer Test from Books by Maggie';
                    $mail->Body = 'This is a test email sent using PHPMailer at ' . date('Y-m-d H:i:s');
                    $mail->AltBody = 'This is a test email sent using PHPMailer at ' . date('Y-m-d H:i:s');
                    
                    // Capture output
                    ob_start();
                    $result = $mail->send();
                    $debug_output = ob_get_clean();
                    
                    echo "<p class='success'>PHPMailer test email sent to $to. Please check your inbox and spam folder.</p>";
                    echo "<p>Debug output:</p>";
                    echo "<pre>$debug_output</pre>";
                    
                } catch (Exception $e) {
                    echo "<p class='error'>PHPMailer Error: " . $e->getMessage() . "</p>";
                }
            } else {
                echo "<form method='get'>";
                echo "<input type='hidden' name='test_phpmailer' value='1'>";
                echo "<p>Email address to test: <input type='email' name='phpmailer_email' value='" . (defined('FROM_EMAIL') ? FROM_EMAIL : '') . "' required></p>";
                echo "<p><button type='submit'>Send Test Email with PHPMailer</button></p>";
                echo "</form>";
            }
        } else {
            echo "<p class='error'>PHPMailer class is not available</p>";
        }
        ?>
    </div>

    <div class="test-section">
        <h2>7. Error Logs</h2>
        <?php
        $error_log = ini_get('error_log');
        echo "<p>PHP error_log path: " . ($error_log ? $error_log : "Not set") . "</p>";
        
        $log_files = [
            'PHP Error Log' => $error_log,
            'Custom Error Log' => __DIR__ . '/error_log',
            'Contact Log' => __DIR__ . '/contact_log.txt'
        ];
        
        foreach ($log_files as $name => $log_file) {
            if ($log_file && file_exists($log_file) && is_readable($log_file)) {
                $log_size = filesize($log_file);
                echo "<p>$name exists (Size: " . round($log_size / 1024, 2) . " KB)</p>";
                
                if ($log_size > 0 && $log_size < 100000) { // Only show if file is not too large
                    $log_content = file_get_contents($log_file);
                    $last_lines = array_slice(explode("\n", $log_content), -20); // Get last 20 lines
                    echo "<p>Last few lines:</p>";
                    echo "<pre>" . htmlspecialchars(implode("\n", $last_lines)) . "</pre>";
                } else if ($log_size > 100000) {
                    echo "<p>Log file is too large to display here.</p>";
                }
            } else {
                if ($log_file) {
                    echo "<p>$name does not exist or is not readable at: $log_file</p>";
                }
            }
        }
        ?>
    </div>

    <h2>Next Steps</h2>
    <p>Based on the diagnostics above, here are some common solutions:</p>
    <ol>
        <li>If PHPMailer is not found, run <code>composer require phpmailer/phpmailer</code> in your api directory</li>
        <li>If file permissions are incorrect, use <code>chmod 666 subscribers.txt</code> and <code>chmod 666 contact_log.txt</code></li>
        <li>If SMTP settings are incorrect, update your config.php file</li>
        <li>If mail() function is not available, you must use PHPMailer with SMTP</li>
    </ol>
</body>
</html>
