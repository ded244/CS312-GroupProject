# CS312-GroupProject

## Run locally

Install dependencies with `npm ci` in both `client` and `server`. Copy `.env.example` to `.env` in the project root and fill in `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_NAME`, and `SESSION_SECRET`. The `.env` file is ignored by Git. Use a dedicated PostgreSQL database for this project; do not load the banking tables into another project's database. Create that database, then apply `schema.sql` followed by `mock_data.sql` to it. The server also accepts PostgreSQL's standard `PG*` connection variables when no `DB_*` value is set.

Run `npm start` in `server` and `npm run dev` in `client`, then open the Vite URL shown in the terminal. The sample data includes the `admin` user with password `password` for local testing. After sign-in, `/accounts` lists that user's accounts; click one to see its details and transactions.

After signing in, an account detail page is available at `/accounts/<account-number>/<routing-number>`. For the sample `admin` user, one example is `/accounts/0000000001/000000001`. The account details API requires the login session and returns data only for accounts owned by that user.
