#!/bin/bash
docker exec -i db pg_dump -U compose-postgres >./$(date +"%Y-%m-%d-%H%M%S")-compose-postgres-backup.sql
docker exec -i db pg_dump -a -U compose-postgres >./$(date +"%Y-%m-%d-%H%M%S")-compose-postgres-backup_data_only.sql
docker exec -i db pg_dump -s -U compose-postgres >./$(date +"%Y-%m-%d-%H%M%S")-compose-postgres-backup_schema_only.sql
