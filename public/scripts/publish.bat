@echo off
curl "{{jenkinsUrl}}/buildWithParameters" --user {{jenkinsUsername}}:{{jenkinsPasswordOrToken}} --data Branch={{fabanBranchName}} --data verboisty=high