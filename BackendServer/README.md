# Getting Setup with Docker

## Requirements

Install the following

- `docker`
- `docker-compose`

make sure the docker service is running (`systemctl start docker`)

## Run

- Build and start everything with `DOCKER_BUILDKIT=1 docker-compose up --build`

- T backup the database, execute `db_backup.sh` (found in `utils`)
- To insert sql dump data into the development database, execute:
  `bash db_restore.sh <path-to-sql-file>` (also found in utils)

# Keycloak

- default user for website is `username: admin` and `password: admin`
- URL for admin panel is `http://localhost:9093` ->  `Admin Console`. Login with `username: keycloak-admin`
  and `password: keycloak-admin`

## Database

restore databases with `db_restore.sh <sql-dump>`
