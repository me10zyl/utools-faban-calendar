@echo off
cd {{basePath}} || goto :error
if not exist {{projectName}}-{{fabanBranchName}} (
    git clone {{gitUrl}} {{projectName}}-{{fabanBranchName}} || goto :error
)
cd {{projectName}}-{{fabanBranchName}} || goto :error
git checkout {{fabanBranchName}} || goto :error
git pull
git status || goto :error
for /f "tokens=*" %%i in ('git rev-parse --abbrev-ref HEAD') do set CURRENT_BRANCH=%%i || goto :error
echo current branch %CURRENT_BRANCH%
if %CURRENT_BRANCH% NEQ {{fabanBranchName}} (
    echo branch not correct: %CURRENT_BRANCH% not {{fabanBranchName}}
    goto :error
)
git fetch
git merge-base --is-ancestor  origin/{{branch}}  {{fabanBranchName}}
set MSG={{fabanBranchName}} not merge {{branch}}
if %errorlevel% EQU 0 (
    set MSG={{fabanBranchName}} has merged {{branch}}
    goto :end
)
goto :end
:error
echo 执行脚本失败
exit /b 1
:end
echo %MSG%