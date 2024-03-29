# SkinX Assignment: Software Engineer (Fullstack)

## Installation

```bash
$ npm install
```

## Database Preparation
```bash
$ docker pull posgres

$ docker run --name skinx-postgres -e POSTGRES_DB=skinx -p 5432:5432 -d postgres
```

## Migration & Seed

```bash
$ npm run migration:run

$ npm run seed:run
```

## Running the app

```bash
$ npm run start:dev
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```
