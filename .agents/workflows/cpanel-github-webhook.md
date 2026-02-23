---
description: Create a reliable GitHub webhook for automatic cPanel deployments
---

# How to Set Up a GitHub Webhook for cPanel Deployment (Simplified)

This guide walks you through the fastest and most reliable way to set up automatic test-proof cPanel deployments from GitHub using a custom `deploy.php` webhook script. 

### Why Use This Method?
cPanel's native webhook URLs require an authenticated session and often get blocked by `404 Not Found` errors when GitHub tries to send its test pings. This custom webhook script bypasses those issues while securely triggering the cPanel Git tools in the background.

---

## Step 1: Create the Deployment Script Locally
Create a file named `deploy.php` in the root folder of your project and paste the code below. 

Be sure to update two things before saving:
1. `YOUR_SECRET_TOKEN` (Create a secure keyword like "myAwesomeDeploy2026")
2. `$repo_path` (Update with your specific cPanel username and repository folder name)

```php
<?php
// 1. Set your secure token
$secret_token = 'YOUR_SECRET_TOKEN';

// 2. Authenticate the webhook ping
$token = $_GET['token'] ?? '';
if ($token !== $secret_token) {
    header('HTTP/1.1 403 Forbidden');
    die('Forbidden');
}

// 3. Prepare logging
$log_file = __DIR__ . '/deploy.log';
file_put_contents($log_file, date('Y-m-d H:i:s') . " - Webhook triggered\n", FILE_APPEND);

// 4. Set the path to the cPanel Git Repository
// IMPORTANT: Replace 'username' and 'repo_name' mapped in cPanel!
$repo_path = "/home/username/repo_name"; 

if (!is_dir($repo_path . '/.git')) {
    file_put_contents($log_file, "Error: Repository not found at $repo_path.\n", FILE_APPEND);
    header('HTTP/1.1 500 Internal Server Error');
    die('Repository not found');
}

// 5. Pull the latest code using cPanel UAPI
$pull_cmd = "/usr/bin/uapi VersionControl update repository_root=" . escapeshellarg($repo_path);
$pull_output = shell_exec($pull_cmd . " 2>&1");
file_put_contents($log_file, "Update Output:\n" . $pull_output . "\n", FILE_APPEND);

// 6. Trigger the cPanel deployment (.cpanel.yml file)
$deploy_cmd = "/usr/bin/uapi VersionControlDeployment create repository_root=" . escapeshellarg($repo_path);
$deploy_output = shell_exec($deploy_cmd . " 2>&1");
file_put_contents($log_file, "Deploy Output:\n" . $deploy_output . "\n", FILE_APPEND);

// 7. Success message back to GitHub
header('HTTP/1.1 200 OK');
echo "Deployment triggered successfully.\n";
?>
```

## Step 2: Push to GitHub First
Commit the new `deploy.php` file and push it up to the `main` branch of your GitHub repository. **Do this before hooking anything up to cPanel.**

## Step 3: Link cPanel (The Initial Clone)
Now that the script is safe in GitHub, log in to cPanel.
1. Go to **Git Version Control**.
2. Click **Create** to clone the repository to your server for the first time.
3. Because cPanel is pulling the repo *after* you added `deploy.php`, this initial clone will safely pull `deploy.php` straight into your live public folder so it can start listening.

## Step 4: Configure GitHub Webhook
Head back to your GitHub repository in the browser.
1. Click the **Settings** tab.
2. Select **Webhooks** from the sidebar, then click **Add webhook**.
3. **Payload URL:** Set this to your live server link plus your secret token.
`https://yourdomain.com/deploy.php?token=YOUR_SECRET_TOKEN`
4. **Content type:** Select `application/json`.
5. Under "Which events would you like to trigger this webhook?", leave **Just the push event** selected.
6. Check **Active** and click **Add webhook**.

GitHub will immediately send a test ping, find your fully setup `deploy.php` script on the live server, and grant you an instant **Green Checkmark ✅**.

You are now fully automated!
