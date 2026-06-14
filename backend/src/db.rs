use sqlx::postgres::PgPoolOptions;
use sqlx::PgPool;
use tracing::info;
use std::path::Path;

/// Create and return a PostgreSQL connection pool.
/// Also runs any pending migrations from the `./migrations` directory.
pub async fn init_pool(database_url: &str) -> PgPool {
    let pool = PgPoolOptions::new()
        .max_connections(10)
        .connect(database_url)
        .await
        .expect("Failed to create database pool");

    info!("Connected to PostgreSQL");

    // Run migrations at runtime from the migrations directory
    let migrations_path = Path::new("./migrations");
    if migrations_path.exists() {
        let migrator = sqlx::migrate::Migrator::new(migrations_path)
            .await
            .expect("Failed to load migrations");

        migrator
            .run(&pool)
            .await
            .expect("Failed to run database migrations");

        info!("Database migrations applied successfully");
    } else {
        tracing::warn!("No migrations directory found, skipping migrations");
    }

    pool
}
