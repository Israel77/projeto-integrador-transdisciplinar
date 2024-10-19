use actix_session::Session;
use actix_web::{put, web, HttpResponse, Responder};
use serde::Deserialize;
use serde_json::json;
use sqlx::types::Uuid;

use crate::{
    errors::error::ListaErros, services::coluna_service,
    services::coluna_service::alterar_nome_coluna,
};

#[derive(Deserialize)]
pub struct CriarColunaDTO {
    #[serde(rename = "nomeColuna")]
    pub nome_coluna: String,
    #[serde(rename = "idQuadro")]
    pub id_quadro: String,
    #[serde(rename = "ordemColuna")]
    pub ordem_coluna: i32,
}

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

#[put("/coluna/criar")]
pub async fn criar_nova_coluna(
    pool: web::Data<sqlx::PgPool>,
    dto: web::Json<CriarColunaDTO>,
    session: Session,
) -> impl Responder {
    if session.get::<String>("id_usuario").is_err()
        || session.get::<String>("id_usuario").unwrap().is_none()
    {
        return ListaErros::ErroUsuarioNaoLogado.as_response();
    }

    let id_usuario_str = session.get::<String>("id_usuario").unwrap().unwrap();
    let id_usuario = Uuid::parse_str(id_usuario_str.as_str());
    if id_usuario.is_err() {
        return ListaErros::ErroUuidInvalid(id_usuario_str).as_response();
    }
    let id_usuario = id_usuario.unwrap();

    let id_quadro_str = &dto.id_quadro;
    let id_quadro = Uuid::parse_str(id_quadro_str);
    if id_quadro.is_err() {
        return ListaErros::ErroUuidInvalid(id_quadro_str.to_owned()).as_response();
    }
    let id_quadro = id_quadro.unwrap();

    let nome_coluna = &dto.nome_coluna;
    let ordem_coluna = dto.ordem_coluna;

    let coluna = coluna_service::criar_nova_coluna(
        &pool,
        &id_quadro,
        nome_coluna,
        ordem_coluna,
        &id_usuario,
    )
    .await;

    match coluna {
        Ok(dados) => HttpResponse::Ok().json(json!({
            "idUsuario": dados.id_usuario.to_string(),
            "idQuadro": id_quadro.to_string(),
            "idColuna": dados.id_coluna.to_string(),
            "ordemColuna": dados.ordem_coluna,
        })),
        Err(e) => e.as_response(),
    }
}
