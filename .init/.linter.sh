#!/bin/bash
cd /home/kavia/workspace/code-generation/hotel-operations-management-platform-163446-163455/smartroomops_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

