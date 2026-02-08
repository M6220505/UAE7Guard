#!/bin/bash
# Connect to UAE7Guard Production Database

export PGPASSWORD='TNIPYYeVqAIVCWnhISZYUBgzIKIbcuCT'

psql -h turntable.proxy.rlwy.net -U postgres -p 15072 -d railway
