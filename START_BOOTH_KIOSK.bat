@echo off
chcp 65001 >nul
rem ==== Petra IT booth launcher: locked kiosk mode (exit only with Alt+F4) ====
rem Opens index.html in Chrome (or Edge) with sound autoplay allowed,
rem in a separate profile so it works even if Chrome is already open.
setlocal
set "HERE=%~dp0"
set "URL=%HERE%index.html"
set "URL=%URL:\=/%"
set "URL=file:///%URL%"
rem Percent-encode the path (Arabic letters, #, etc.) so Chrome accepts it
for /f "usebackq delims=" %%U in (`powershell -NoProfile -ExecutionPolicy Bypass -Command "([uri]($env:HERE + 'index.html')).AbsoluteUri"`) do set "URL=%%U"
set "PROFILE=%HERE%.browser-profile"

set "BROWSER="
for %%P in ("%ProgramFiles%\Google\Chrome\Application\chrome.exe" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" "%LocalAppData%\Google\Chrome\Application\chrome.exe" "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe") do (
  if not defined BROWSER if exist %%P set "BROWSER=%%~P"
)
if not defined BROWSER (
  echo Chrome / Edge not found. Open index.html manually.
  pause
  exit /b 1
)

start "" "%BROWSER%" --user-data-dir="%PROFILE%" --autoplay-policy=no-user-gesture-required --no-first-run --no-default-browser-check --disable-sync --disable-session-crashed-bubble --disable-features=Translate --overscroll-history-navigation=0 --kiosk --app="%URL%"
endlocal
