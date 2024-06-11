# Hart Print - Production Schedule

## Installation

Copy the `.env.example` file to `.env`

```bash
cp .env.example .env
```

Edit the `.env` file to set your database credentials.

```bash
php artisan key:generate
php artisan migrate # run migrations
```

To add products & product types to your database, run the following command:

```bash
php artisan app:seed-database
```
