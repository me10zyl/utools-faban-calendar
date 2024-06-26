@echo off
cd {{basePath}} || goto :error
if  not exist {{projectName}}-{{fabanBranchName}} (
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
git pull || goto :error
git pull origin {{branch}} --ff-only || (echo Merge failed detected!
    goto :error
)
git push
goto :end
:error
echo A command failed. Exiting script.
exit /b 1
:end
echo Script finished successfully.