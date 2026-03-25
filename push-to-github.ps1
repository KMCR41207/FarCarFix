# GitHub Push Script
# Replace YOUR_TOKEN_HERE with your actual GitHub Personal Access Token

$token = Read-Host "Enter your GitHub Personal Access Token"
$repo = "https://$token@github.com/KMCR41207/FarCarFix.git"

Write-Host "Setting remote URL with token..." -ForegroundColor Green
git remote set-url origin $repo

Write-Host "Pushing to GitHub..." -ForegroundColor Green
git push -u origin main

Write-Host "Done! Check your repository at: https://github.com/KMCR41207/FarCarFix" -ForegroundColor Green
