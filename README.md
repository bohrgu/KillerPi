# KillerPi

Killer Game that can run on a Unix Raspberry Pi using SQLite database or on another Unix plateform using Postgres database.

Please consider installing a Postgres database and setting the following environment variables:

- export NODE_ENV=production
- export DATABASE_URL=postgres://**username**:**passwordIfNeeded**@127.0.0.1:5432/**databaseName**

If you do not set these variables it will create an SQLite database (if it doesn't already exists) named Killer.db

Regardless the type of database, all tables will be automatically created using models, but you can check the dbinit.sql script to have a look at the structure.
