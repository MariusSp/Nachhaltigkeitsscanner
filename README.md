# Nachhaltigkeitsscanner

This project contains an Web Plattform build with Spring Boot, Angular, SQL and Keycloak Authentication and was created as part of a university project.

## Structure

- `Backend` contains the backend Spring Boot server, as well as instructions for a development backend docker setup,
  containing the Spring Boot server, Keycloak and a Postgres database.
- `webapp` contains the Angular frontend.

### git-lfs

Initialize your user account for git-lfs **once**

```git lfs install```

If you want to add a new filetype to git-lfs, run

```git lfs track "<.file-extension>"```

and then add the file(s) to git, commit and push...

```git add file.<file-extension>```

#### Download
In case binary blobs aren't loaded into your local repo, run

```git lfs pull```
