@echo off
cd {{basePath}} || goto :error
if not exist {{projectName}} (
    git clone {{gitUrl}} {{projectName}} || goto :error
)
cd {{projectName}} || goto :error
git pull
git branch {{branch}} origin/{{releaseBranch}} || goto :error
git push -u origin {{branch}} || goto :error
goto :end
:error
echo A command failed. Exiting script.
exit /b 1
:end
echo Script finished successfully.