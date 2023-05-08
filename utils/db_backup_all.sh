#!/bin/bash
docker exec -i db pg_dumpall -U compose-postgres >./$(date +"%Y-%m-%d-%H%M%S")-db-backup.sql
docker exec -i db pg_dumpall -a -U compose-postgres >./$(date +"%Y-%m-%d-%H%M%S")-db-backup_data_only.sql
docker exec -i db pg_dumpall -s -U compose-postgres >./$(date +"%Y-%m-%d-%H%M%S")-db-backup_schema_only.sql
