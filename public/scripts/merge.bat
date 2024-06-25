@echo off
cd C:\forfaban || goto :error
if  not exist mockserver-dev (
    git clone https://gitlab.100bm.cn/zengyl/mockserver.git/ mockserver-dev || goto :error
)
cd mockserver-dev || goto :error
git status || goto :error
for /f "tokens=*" %%i in ('git rev-parse --abbrev-ref HEAD') do set CURRENT_BRANCH=%%i || goto :error
echo current branch %CURRENT_BRANCH%
if %CURRENT_BRANCH% NEQ main (
    echo branch not correct: main
    goto :error
)
git pull || goto :error
git pull origin feature-yiye --ff-only || (echo Merge failed detected!
    goto :error
)
git push
goto :end
:error
echo A command failed. Exiting script.
exit /b 1
:end
echo Script finished successfully.