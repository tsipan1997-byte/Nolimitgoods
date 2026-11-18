@echo off
REM Запускається Планувальником завдань Windows. Оновлює ставки і пушить на сайт.
cd /d "%~dp0..\.."
node scripts\auto-bids\update-bids.mjs >> scripts\auto-bids\task-output.log 2>&1
