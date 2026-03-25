@echo off
echo ==========================================
echo Aura AI Dashboard - Windows Setup
echo ==========================================

:: Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Python is not installed or not in PATH.
    echo Please install Python from https://www.python.org/
    pause
    exit /b
)

:: Create virtual environment
echo Creating virtual environment...
python -m venv venv

:: Activate virtual environment and install requirements
echo Installing dependencies...
call venv\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt

echo ==========================================
echo Setup Complete!
echo You can now run the app using run_aura.bat
echo ==========================================
pause
