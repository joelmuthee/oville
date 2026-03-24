$exclude = @('.git', 'oville_latest_backup.zip', '.agents', '.vscode', 'backup.ps1')
$files = Get-ChildItem -Path . -Exclude $exclude
Compress-Archive -Path $files -DestinationPath oville_latest_backup_v2.zip -Force
Write-Host "Backup created: oville_latest_backup_v2.zip"
Get-Item oville_latest_backup_v2.zip | Select-Object Name, @{Name='SizeMB'; Expression={$_.Length / 1MB}}
