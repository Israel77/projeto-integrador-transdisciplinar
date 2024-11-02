use actix_session::Session;
use actix_web::{get, put, web, HttpResponse, Responder};
use serde::Deserialize;
use serde_json::json;
use sqlx::types::Uuid;

use crate::{
    errors::error::ListaErros,
    services::quadro_service::{self, consultar_ids_quadros_usuario, consultar_quadro_por_id},
};

#[derive(Deserialize)]
pub struct CriarQuadroDTO {
    #[serde(rename = "tituloQuadro")]
    pub titulo_quadro: String,
    #[serde(rename = "descricaoQuadro")]
    pub descricao_quadro: String,
    #[serde(rename = "nomesColunas")]
    pub nomes_colunas: Vec<String>,
}

#[get("/quadro/{id_quadro}")]
async fn retornar_quadros(
    id_quadro: web::Path<String>,
    pool: web::Data<sqlx::PgPool>,
    session: Session,
) -> impl Responder {
    let usuario = session.get::<String>("id_usuario").unwrap();

    if let Some(usuario) = usuario {
        match consultar_quadro_por_id(&pool, &id_quadro.into_inner(), &usuario).await {
            Ok(quadro_dto) => HttpResponse::Ok().json(quadro_dto),
            Err(e) => e.as_response(),
        }
    } else {
        ListaErros::ErroUsuarioNaoAutorizado("não identificado".to_string()).as_response()
    }
}

#[get("/listar-quadros/{id_usuario}")]
async fn retornar_quadros_do_usuario(
    id_usuario: web::Path<String>,
    pool: web::Data<sqlx::PgPool>,
    session: Session,
) -> impl Responder {
    let id_sessao = session.get::<String>("id_usuario");
    let id_usuario = id_usuario.into_inner();

    match id_sessao {
        Ok(id_sessao) if id_sessao.is_some() && id_usuario == id_sessao.clone().unwrap() => {
            match consultar_ids_quadros_usuario(&pool, &id_usuario).await {
                Ok(id_quadros) => HttpResponse::Ok().json(id_quadros),
                Err(e) => e.as_response(),
            }
        }
        Ok(id_sessao) if id_sessao.is_some() => {
            println!(
                "id_sessao: {}, id_usuario: {}",
                id_sessao.clone().unwrap(),
                id_usuario
            );
            ListaErros::ErroUsuarioNaoAutorizado(id_sessao.unwrap().to_string()).as_response()
        }
        _ => ListaErros::ErroUsuarioNaoAutorizado("não identificado".to_string()).as_response(),
    }
}

#[put("/quadro/criar")]
async fn criar_quadro(
    criar_quadro_dto: web::Json<CriarQuadroDTO>,
    pool: web::Data<sqlx::PgPool>,
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

    let titulo_quadro = &criar_quadro_dto.titulo_quadro;
    let descricao_quadro = &criar_quadro_dto.descricao_quadro;
    let nomes_colunas = criar_quadro_dto
        .nomes_colunas
        .iter()
        .map(|s| s.as_ref())
        .collect();

    quadro_service::criar_novo_quadro(
        &pool,
        &id_usuario,
        titulo_quadro,
        descricao_quadro,
        nomes_colunas,
    )
    .await
    .map(|id_quadro| {
        HttpResponse::Ok().json(json!({
            "idQuadro": id_quadro.to_string()
        }))
    })
    .unwrap_or_else(|err| err.as_response())
}
