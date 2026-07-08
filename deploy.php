<?php
// Secret token lives outside the web root and outside git.
// This repo is public, so the token must never be committed.
$token_file = '/home/qtylnoyg/.oville_deploy_token';

$secret_token = null;
if (is_readable($token_file)) {
    $secret_token = trim(file_get_contents($token_file));
} elseif (getenv('OVILLE_DEPLOY_TOKEN')) {
    $secret_token = trim(getenv('OVILLE_DEPLOY_TOKEN'));
}

// Fail closed: no configured token means nobody can deploy.
if ($secret_token === null || $secret_token === '') {
    header('HTTP/1.1 503 Service Unavailable');
    die('Deploy token not configured');
}

// Check token. hash_equals avoids leaking the token via timing.
$token = $_GET['token'] ?? '';
if (!hash_equals($secret_token, $token)) {
    header('HTTP/1.1 403 Forbidden');
    die('Forbidden');
}

// Log outside the web root so it is not publicly fetchable.
$log_file = dirname(__DIR__) . '/deploy.log';
file_put_contents($log_file, date('Y-m-d H:i:s') . " - Webhook triggered\n", FILE_APPEND);

// Paths to check for the repository
$possible_paths = [
    "/home/qtylnoyg/oville_live",
    "/home/qtylnoyg/repositories/oville_live",
    "/home/qtylnoyg/Oville"
];

$repo_path = null;
foreach ($possible_paths as $path) {
    if (is_dir($path . '/.git')) {
        $repo_path = $path;
        break;
    }
}

if (!$repo_path) {
    file_put_contents($log_file, "Error: Repository not found.\n", FILE_APPEND);
    header('HTTP/1.1 500 Internal Server Error');
    die('Repository not found');
}

// 1. Pull the latest code using cPanel UAPI (using retrieve instead of update)
$pull_cmd = "/usr/bin/uapi VersionControl retrieve repository_root=" . escapeshellarg($repo_path);
$pull_output = shell_exec($pull_cmd . " 2>&1");
file_put_contents($log_file, "Retrieve Output:\n" . $pull_output . "\n", FILE_APPEND);

// 2. Ensure we are on the right branch/metadata (optional but helpful)
$update_cmd = "/usr/bin/uapi VersionControl update repository_root=" . escapeshellarg($repo_path);
$update_output = shell_exec($update_cmd . " 2>&1");
file_put_contents($log_file, "Update Output:\n" . $update_output . "\n", FILE_APPEND);

// 3. Trigger the deployment (.cpanel.yml) using cPanel UAPI
$deploy_cmd = "/usr/bin/uapi VersionControlDeployment create repository_root=" . escapeshellarg($repo_path);
$deploy_output = shell_exec($deploy_cmd . " 2>&1");
file_put_contents($log_file, "Deploy Output:\n" . $deploy_output . "\n", FILE_APPEND);

header('HTTP/1.1 200 OK');
echo "Deployment triggered successfully.\n";
?>