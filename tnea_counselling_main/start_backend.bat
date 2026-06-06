@echo off
REM Start the T.I.M.E Backend Server
REM Run this from the project root: Tnea_Counseling-main\

echo ========================================
echo   T.I.M.E Backend Server
echo ========================================
echo.

REM Check if .env is set
if not exist "backend\app\.env" (
    echo [WARNING] No .env file found at backend\app\.env
    echo Please create it if you need specific environment variables.
    echo.
)

echo Starting FastAPI server on port 8000...
echo Frontend should be running on port 5173
echo.
echo API Docs available at: http://localhost:8000/docs
echo Health Check: http://localhost:8000/health
echo.

cd backend
if exist ".venv\Scripts\python.exe" (
    echo Using virtual environment...
    ".venv\Scripts\python.exe" -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
) else (
    echo Virtual environment not found, using global python...
    python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
)
