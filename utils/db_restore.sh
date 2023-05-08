#!/bin/bash
docker cp $1 db:/$1
docker exec -i db psql -U compose-postgres -f $1 compose-postgres
