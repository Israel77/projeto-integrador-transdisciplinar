mod errors;
mod persistence;
mod routes;
mod services;

use std::env;

use actix_files::Files;
use actix_session::{storage::RedisSessionStore, SessionMiddleware};
use actix_web::{
    cookie::Key,
    web::{self, scope},
    App, HttpServer,
};
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

    // TODO: Substituir por chave armazenada em variáveis de ambiente
    let secret_key = Key::generate();

    let redis_store = RedisSessionStore::new("redis://localhost:6379")
        .await
        .unwrap();

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .wrap(SessionMiddleware::new(
                redis_store.clone(),
                secret_key.clone(),
            ))
            .service(
                scope("/api/v1")
                    .service(routes::quadro::retornar_quadros)
                    .service(routes::auth::sign_up)
                    .service(routes::auth::login)
                    .service(routes::auth::logout)
                    .service(routes::auth::verificar_login),
            )
            .service(Files::new("/login", "./static/pages/login/").index_file("index.html"))
            .service(Files::new("/main", "./static/pages/main/").index_file("index.html"))
            .service(Files::new("/components", "./static/components"))
            .service(Files::new("/services", "./static/services"))
            .service(Files::new("/", "./static").index_file("index.html"))
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}
