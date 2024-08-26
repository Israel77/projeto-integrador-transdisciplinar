mod persistence;
mod routes;

use std::env;

use actix_files::Files;
use actix_web::{web, App, HttpServer};
use dotenv::dotenv;
use sqlx::postgres::PgPoolOptions;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Servidor rodando na porta 8080 do container");
    dotenv().ok();

    let database_url =
        env::var("DATABASE_URL")
        .expect("DATABASE_URL não está definido no arquivo .env e não foi encontrada em variáveis de ambiente");

    let pool = PgPoolOptions::new()
        .connect(&database_url)
        .await
        .expect("Erro ao conectar ao banco de dados");

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .service(web::scope("/api/v1").service(routes::quadro::retornar_quadros))
            .service(Files::new("/", "./static").index_file("index.html"))
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}
