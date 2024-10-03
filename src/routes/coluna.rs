use actix_session::Session;
use actix_web::{put, web, HttpResponse, Responder};
use serde::Deserialize;
use sqlx::types::Uuid;

use crate::services::coluna_service::alterar_nome_coluna;

#[derive(Deserialize)]
pub struct MudarNomeColunaDTO {
    #[serde(rename = "novoNome")]
    pub novo_nome: String,
    #[serde(rename = "idColuna")]
    pub id_coluna: String,
}

#[put("/coluna/atualizar/nome")]
pub async fn mudar_nome_coluna(
    pool: web::Data<sqlx::PgPool>,
    dto: web::Json<MudarNomeColunaDTO>,
    session: Session,
) -> impl Responder {
    // TODO: Analisar a necessidade de validar se a coluna pertence ao usuário logado
    let usuario = session.get::<String>("id_usuario").unwrap();

    match alterar_nome_coluna(
        &pool,
        &Uuid::parse_str(dto.id_coluna.as_str()).unwrap(),
        &dto.novo_nome,
    )
    .await
    {
        Ok(_) => HttpResponse::Ok().json("Ok"),
        Err(err) => err.as_response(),
    }
}
