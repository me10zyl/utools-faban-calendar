@echo off
cd C:\forfaban || goto :error
if  not exist mockserver-dev (
    git clone https://gitlab.100bm.cn/zengyl/mockserver mockserver-dev || goto :error
)
cd mockserver-dev || goto :error
git branch abc origin/master || goto :error
git push -u origin abc || goto :error
goto :end
:error
echo A command failed. Exiting script.
exit /b 1
:end
echo Script finished successfully.