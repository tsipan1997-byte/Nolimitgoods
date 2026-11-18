# Одноразове налаштування домашнього ноутбука (Windows 10/11).
# Запуск: правою кнопкою на PowerShell -> "Запустити від імені адміністратора", далі:
#   Set-ExecutionPolicy -Scope Process Bypass; .\setup.ps1
$ErrorActionPreference = 'Stop'
$Repo = 'https://github.com/tsipan1997-byte/Nolimitgoods.git'
$Dir  = "$env:USERPROFILE\nolimitgoods"

Write-Host '1/5 Встановлюю Git, Node.js і Chrome (якщо ще немає)...'
foreach ($id in 'Git.Git','OpenJS.NodeJS.LTS','Google.Chrome') {
  winget install --id $id -e --silent --accept-package-agreements --accept-source-agreements | Out-Null
}
$env:Path = [Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [Environment]::GetEnvironmentVariable('Path','User')

Write-Host '2/5 Завантажую сайт з GitHub...'
if (-not (Test-Path $Dir)) { git clone --depth 50 $Repo $Dir } else { git -C $Dir pull --rebase }
git -C $Dir config user.name  'NLG home PC'
git -C $Dir config user.email 'bot@nolimitgoods.com'

Write-Host '3/5 Ставлю залежності скрипта...'
Push-Location "$Dir\scripts\auto-bids"; npm install --no-audit --no-fund | Out-Null; Pop-Location

Write-Host '4/5 Розклад: щодня о 08:00, 14:00 і 20:00...'
$action   = New-ScheduledTaskAction -Execute "$Dir\scripts\auto-bids\run.cmd"
$triggers = '08:00','14:00','20:00' | ForEach-Object { New-ScheduledTaskTrigger -Daily -At $_ }
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -WakeToRun -AllowStartIfOnBatteries -ExecutionTimeLimit (New-TimeSpan -Minutes 30)
Register-ScheduledTask -TaskName 'NLG auction bids' -Action $action -Trigger $triggers -Settings $settings -Force | Out-Null

Write-Host '5/5 Вимикаю сон при живленні від мережі і реакцію на закриту кришку...'
powercfg /change standby-timeout-ac 0
powercfg /change hibernate-timeout-ac 0
powercfg /setacvalueindex SCHEME_CURRENT SUB_BUTTONS LIDACTION 0
powercfg /setactive SCHEME_CURRENT

Write-Host ''
Write-Host 'Готово. Тепер один раз запустіть тест (відкриється вхід у GitHub — увійдіть):'
Write-Host "  cd $Dir; node scripts\auto-bids\update-bids.mjs"
