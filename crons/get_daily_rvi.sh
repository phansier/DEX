#!/bin/bash
cd /home/jbt/myproject/
source myprojectenv/bin/activate
python /home/jbt/myproject/crons/get_daily_rvi.py
