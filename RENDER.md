# Render deployment

The root `render.yaml` creates a Render web service and PostgreSQL database.

1. Push this repository to GitHub and create a new Render Blueprint from it.
2. Set `BACKEND_PUBLIC_URL` to the deployed backend URL, for example `https://hello-universe-backend.onrender.com`.
3. Add the payment and email secrets in the backend service environment variables as needed.
4. Run the schema once against the Render database using Render's database shell or `psql`:

```sh
psql "$DATABASE_URL" -f db/schema.sql
```

5. In the frontend deployment, set `NEXT_PUBLIC_API_URL` to the backend URL, for example:

```text
NEXT_PUBLIC_API_URL=https://hello-universe-backend.onrender.com
```

The backend listens on Render's `PORT`, connects using `DATABASE_URL`, and exposes
`/api/health` for Render's health check. The health check returns `503` if PostgreSQL
is unavailable.