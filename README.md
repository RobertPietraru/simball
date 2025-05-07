# Simball

Simball is a digital dictionary for symbols in Romanian literature. The purpose of this project is to create a tool that will help scholars and students of Romanian literature to understand the symbols used in poems, novels, etc.

## Development

```bash
bun run dev
```

## Database

The database is a PostgreSQL database. It is used to store the symbols and their definitions. We use Drizzle ORM to interact with the database.

To start the database, run the following command:

```bash
bun run db:start
```

To push the database schema to the database, run the following command:

```bash
bun run db:push
```