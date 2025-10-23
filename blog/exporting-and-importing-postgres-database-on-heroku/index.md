---
title: Importing PostgreSQL Databases on Heroku
date: "2020-08-05T11:30:00.000Z"
description: Need to import a PostgreSQL database from Heroku? Check out my walkthrough on how you can import your staging or production database locally so you work with real data.
tags: postgresql,postgres,databases,heroku,import,export
---

I've been "drinking my own champagne" on an app I'm hoping to release soon - a great practice if you want to really improve the experience for customers. In this process, I've created relevant data on production and needed to bring it in locally to work on a few edge cases I discovered.

In this article, I'm going to quickly walk you through how to do that using Heroku, PostgreSQL and Rails.

## Recreating the database

Ok, so first things first - you'll need to recreate your database.

In Rails, this is a two step process of dropping and then creating the database:

**Drop the database**

```
bundle exec rails db:drop
```

**Create the database**

```
bundle exec rails db:create
```

## Creating a backup

We'll need to create a "capture" of the database before importing:

```
 heroku pg:backups:capture --app my-app-name-on-heroku
```

Once the "capture" is done, we need to download it:

```
  heroku pg:backups:download --app my-app-name-on-heroku
```

⚠️ NOTE: This will download a `latest.dump` in the current directory that you're in. So make sure you're ignoring `.dump` files in your `.gitignore` so that you don't accidentally check it in.

## Importing your backup

Finally, we import it:

```
 pg_restore --verbose --clean --no-acl --no-owner -h DB_HOST -U postgres -d DATABASE_NAME latest.dump
```

Replace `DB_HOST` and `DATABASE_NAME` with the connection values you use to connect to the database.

## Changing the environment

In Rails, there is an `ar_internal_metadata` table that keeps track of settings used for <a href="https://github.com/rails/rails/tree/master/activerecord" target="_blank" rel="noopener noreferrer" class="text-deeppink hover:underline">ActiveRecord</a>, the ORM (Object-relational mapper) in Rails. We'll need to update the `environment` key to be `development` - otherwise you'll run into some weird issues.

![](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/exporting-and-importing-postgres-database-on-heroku/postgres-ar-internal-metadata.png)

## References

- <a href="https://devcenter.heroku.com/articles/heroku-postgres-import-export" target="_blank" rel="noopener noreferrer">Importing and Exporting Heroku Postgres Databases</a>
- <a href="https://www.postgresql.org/docs/12/app-pgrestore.html" target="_blank" rel="noopener noreferrer">pg_restore</a>
- <a href="https://devcenter.heroku.com/articles/heroku-postgres-backups" target="_blank" rel="noopener noreferrer">Heroku PGBackups</a>
