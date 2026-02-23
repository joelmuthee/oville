<?php
// Secret token to secure the webhook
$secret_token = 'ovilledep2026';

// Check token
$token = $_GET['token'] ?? '';
if ($token !== $secret_token) {
    header('HTTP/1.1 403 Forbidden');
    die('Forbidden');
}

$log_file = __DIR__ . '/deploy.log';
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

// 1. Pull the latest code using cPanel UAPI
$pull_cmd = "/usr/bin/uapi VersionControl update repository_root=" . escapeshellarg($repo_path);
$pull_output = shell_exec($pull_cmd . " 2>&1");
file_put_contents($log_file, "Update Output:\n" . $pull_output . "\n", FILE_APPEND);

// 2. Trigger the deployment (.cpanel.yml) using cPanel UAPI
$deploy_cmd = "/usr/bin/uapi VersionControlDeployment create repository_root=" . escapeshellarg($repo_path);
$deploy_output = shell_exec($deploy_cmd . " 2>&1");
file_put_contents($log_file, "Deploy Output:\n" . $deploy_output . "\n", FILE_APPEND);

header('HTTP/1.1 200 OK');
echo "Deployment triggered successfully.\n";
?>
