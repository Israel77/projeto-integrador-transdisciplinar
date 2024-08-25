mod persistence;

use actix_files::Files;
use actix_web::{App, HttpServer};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Servidor rodando na porta 8080 do container");
    HttpServer::new(|| App::new().service(Files::new("/", "./static").index_file("index.html")))
        .bind(("0.0.0.0", 8080))?
        .run()
        .await
}
