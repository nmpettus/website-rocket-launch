<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Replace with your Hostinger email settings
define('SMTP_HOST', 'smtp.titan.email');
define('SMTP_USERNAME', 'maggie@booksbymaggie.com');
define('SMTP_PASSWORD', 'Np!43Mp!51');
define('SMTP_PORT', 587);
define('FROM_EMAIL', 'maggie@booksbymaggie.com');
define('FROM_NAME', 'Maggie');
