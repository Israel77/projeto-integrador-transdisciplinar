use actix_session::Session;
use actix_web::{get, web, HttpResponse, Responder};

use crate::{
    errors::error::ListaErros,
    services::quadro_service::{consultar_ids_quadros_usuario, consultar_quadro_por_id},
};

#[get("/quadro/{id_quadro}")]
async fn retornar_quadros(
    id_quadro: web::Path<i32>,
    pool: web::Data<sqlx::PgPool>,
    session: Session,
) -> impl Responder {
    let usuario = session.get::<i32>("id_usuario").unwrap();

    if let Some(usuario) = usuario {
        match consultar_quadro_por_id(&pool, id_quadro.into_inner(), usuario).await {
            Ok(quadro_dto) => HttpResponse::Ok().json(quadro_dto),
            Err(e) => e.as_response(),
        }
    } else {
        ListaErros::ErroUsuarioNaoAutorizado("não identificado".to_string()).as_response()
    }
}

#[get("/listar-quadros/{id_usuario}")]
async fn retornar_quadros_do_usuario(
    id_usuario: web::Path<i32>,
    pool: web::Data<sqlx::PgPool>,
    session: Session,
) -> impl Responder {
    let id_sessao = session.get::<i32>("id_usuario");
    let id_usuario = id_usuario.into_inner();

    match id_sessao {
        Ok(id_sessao) if id_sessao.is_some() && id_usuario == id_sessao.unwrap() => {
            match consultar_ids_quadros_usuario(&pool, id_usuario).await {
                Ok(id_quadros) => HttpResponse::Ok().json(id_quadros),
                Err(e) => e.as_response(),
            }
        }
        Ok(id_sessao) if id_sessao.is_some() => {
            ListaErros::ErroUsuarioNaoAutorizado(id_sessao.unwrap().to_string()).as_response()
        }
        _ => ListaErros::ErroUsuarioNaoAutorizado("não identificado".to_string()).as_response(),
    }
}
