# Quick Start Guide

## Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)

## Installation Steps

### Option 1: Automatic Setup (Windows)
1. Double-click `start.bat` or run `start.ps1` in PowerShell
2. Wait for dependencies to install
3. The application will automatically start

### Option 2: Manual Setup
1. Install root dependencies:
   ```bash
   npm install
   ```

2. Install client dependencies:
   ```bash
   cd client
   npm install
   cd ..
   ```

3. Start the development servers:
   ```bash
   npm run dev
   ```

## Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Features to Test
1. **Toggle Devices**: Click on any device switch to turn it on/off
2. **Monitor Power**: Watch the real-time power and current meters
3. **View Charts**: See the power consumption graph update
4. **Check Status**: Monitor active/inactive devices
5. **Reset**: Use the "Reset Simulation" button

## Troubleshooting
- If ports 3000 or 5000 are in use, the application will show an error
- Make sure Node.js is installed and in your PATH
- Check that all dependencies are installed correctly

## Stopping the Application
Press `Ctrl+C` in the terminal to stop both servers. 