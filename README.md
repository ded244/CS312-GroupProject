# CS312-GroupProject

## Run locally

Install dependencies with `npm ci` in both `client` and `server`. Set the PostgreSQL connection variables `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, and `PGDATABASE` for the server. Apply `schema.sql` and `mock_data.sql` to that database. Run `npm start` in `server` and `npm run dev` in `client`.

After signing in, an account detail page is available at `/accounts/<account-number>/<routing-number>`. For the sample `admin` user, one example is `/accounts/0000000001/000000001`. The account details API requires the login session and returns data only for accounts owned by that user.
