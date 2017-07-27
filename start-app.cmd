@for /d %%i in (*) do @call :sub %%i
@goto start
@:sub
@if "%1" == "node_modules" goto end
@node -p "'\x1b[36;1m%1\x1b[m'"
@cd %1
@if exist package.json if not exist node_modules call npm install
@cd ..
@goto end
@:start
start http://localhost:3000
node 02-express-web-server\express-web-server . 3000
@pause
@:end
