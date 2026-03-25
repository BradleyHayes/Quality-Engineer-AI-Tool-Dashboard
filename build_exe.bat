@echo off
:: Check if virtual environment exists
if not exist venv\Scripts\activate.bat (
    echo Error: Virtual environment not found. 
    echo Please run setup_windows.bat first!
    pause
    exit /b
)

:: Activate virtual environment and build the exe
echo Building standalone executable...
call venv\Scripts\activate
pip install pyinstaller
pyinstaller --noconsole --onefile --name "Aura_AI_Dashboard" aura_dashboard.py

echo ==========================================
echo Build Complete!
echo Your executable is in the 'dist' folder.
echo ==========================================
pause
