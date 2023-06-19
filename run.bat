@echo off

rem Add your Node.js commands here

echo Starting to run commands...

echo Running server
cd server
start npm run start
cd ..
timeout /t 5 >nul

echo Running kafaka-connector
cd kafaka-connector
start npm run run
cd ..
timeout /t 5 >nul

echo Running universe-simulator
cd universe-simulator
start npm run run
cd ..
timeout /t 5 >nul

echo Running dashboard
cd dashboard
start npm run dev
cd ..

echo All commands executed.

pause
