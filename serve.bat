@echo off
echo.
echo  Solar System Simulator - local server
echo  Open: http://localhost:8080/index.html
echo  Press Ctrl+C to stop.
echo.
where pnpm >nul 2>&1
if %ERRORLEVEL%==0 (
  pnpm start
) else (
  python -m http.server 8080
)
