@echo off
title Seeding Ikram Jewellers Database
echo =========================================================
echo Seeding Gold & Diamond Jewelry Catalogue into Firestore...
echo =========================================================
echo.

python seed-database.py

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Seeding failed. Ensure you are logged in to the Firebase CLI.
    echo Try running: firebase login
) else (
    echo.
    echo [SUCCESS] Seeding completed successfully!
    echo Refresh your website or admin console to view the new database items.
)

echo.
pause
