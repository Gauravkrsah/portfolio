# This script helps set up GitHub repository secrets for cPanel deployment
# It requires the GitHub CLI to be installed

$repoName = Read-Host -Prompt "Enter your GitHub repository name (format: username/repo-name)"
Write-Host "Setting up GitHub repository secrets for $repoName..."

# FTP Server
$ftpServer = Read-Host -Prompt "Enter your cPanel FTP server address (e.g., ftp.yourdomain.com)"
gh secret set CPANEL_FTP_SERVER --repo $repoName --body $ftpServer

# FTP Username
$ftpUsername = Read-Host -Prompt "Enter your cPanel FTP username"
gh secret set CPANEL_FTP_USERNAME --repo $repoName --body $ftpUsername

# FTP Password
$ftpPassword = Read-Host -Prompt "Enter your cPanel FTP password" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($ftpPassword)
$ftpPasswordPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
gh secret set CPANEL_FTP_PASSWORD --repo $repoName --body $ftpPasswordPlain

# Gemini API Key
$geminiApiKey = Read-Host -Prompt "Enter your Google Gemini API Key" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($geminiApiKey)
$geminiApiKeyPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
gh secret set GEMINI_API_KEY --repo $repoName --body $geminiApiKeyPlain

# Supabase URL
$supabaseUrl = Read-Host -Prompt "Enter your Supabase URL"
gh secret set SUPABASE_URL --repo $repoName --body $supabaseUrl

# Supabase Anon Key
$supabaseAnonKey = Read-Host -Prompt "Enter your Supabase Anon Key" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($supabaseAnonKey)
$supabaseAnonKeyPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
gh secret set SUPABASE_ANON_KEY --repo $repoName --body $supabaseAnonKeyPlain

# Supabase Service Role Key
$supabaseServiceRoleKey = Read-Host -Prompt "Enter your Supabase Service Role Key" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($supabaseServiceRoleKey)
$supabaseServiceRoleKeyPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
gh secret set SUPABASE_SERVICE_ROLE_KEY --repo $repoName --body $supabaseServiceRoleKeyPlain

Write-Host "Done! GitHub secrets have been set up for automated deployment."
Write-Host "Push changes to the main branch to trigger deployment."
