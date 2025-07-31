@echo off
echo Starting Power Simulator...
echo.

echo Installing root dependencies...
call npm install

echo.
echo Installing client dependencies...
cd client
call npm install
cd ..

echo.
echo Starting development servers...
echo Backend will run on http://localhost:5000
echo Frontend will run on http://localhost:3000
echo.
echo Press Ctrl+C to stop the servers
echo.

call npm run dev 