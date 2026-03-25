@echo off
:: Check if virtual environment exists
if not exist venv\Scripts\activate.bat (
    echo Error: Virtual environment not found. 
    echo Please run setup_windows.bat first!
    pause
    exit /b
)

:: Activate virtual environment and run the app
echo Starting Aura AI Dashboard...
call venv\Scripts\activate
python aura_dashboard.py
pause
