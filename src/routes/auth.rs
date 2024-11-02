use std::{net::IpAddr, str::FromStr, sync::Arc};

use actix_session::Session;
use actix_web::{get, post, web, HttpRequest, HttpResponse, Responder};
use futures::join;
use serde::{Deserialize, Serialize};
use serde_json::json;
use sqlx::{query, types::Uuid, PgPool};

use crate::{
    errors::error::ListaErros,
    services::{
        auth_service::{login_service, registrar_usuario_service},
        quadro_service::consultar_ids_quadros_usuario,
    },
};

#[derive(Serialize, Deserialize)]
pub struct RequisicaoLogin {
    #[serde(rename = "nomeUsuario")]
    pub nome_usuario: String,
    pub senha: String,
}

#[derive(Serialize, Deserialize)]
pub struct RequisicaoRegistro {
    #[serde(rename = "nomeUsuario")]
    pub nome_usuario: Arc<str>,
    #[serde(rename = "emailUsuario")]
    pub email_usuario: Arc<str>,
    pub senha: Arc<str>,
}

#[post("/login")]
pub async fn login(
    req: web::Json<RequisicaoLogin>,
    pool: web::Data<sqlx::PgPool>,
    session: Session,
) -> impl Responder {
    login_service(
        req.nome_usuario.clone(),
        req.senha.clone(),
        pool.get_ref(),
        session,
    )
    .await
    .map(|result| HttpResponse::Ok().json(result))
    .unwrap_or_else(|err| err.as_response())
}

#[post("/logout")]
pub async fn logout(session: Session) -> impl Responder {
    session.purge();
    HttpResponse::Ok().json("Usuário deslogado com sucesso")
}

#[post("/sign-up")]
pub async fn sign_up(
    req: HttpRequest,
    body: web::Json<RequisicaoRegistro>,
    pool: web::Data<sqlx::PgPool>,
    session: Session,
) -> impl Responder {
    const COMPRIMENTO_MIN_SENHA: usize = 8;
    const COST: u32 = bcrypt::DEFAULT_COST;

    if body.senha.len() < COMPRIMENTO_MIN_SENHA {
        return ListaErros::ErroSenhaCurta.as_response();
    }

    let (buscar_usuario, buscar_email) = join!(
        sqlx::query!(
            "SELECT * FROM kanban.usuarios WHERE nome_usuario = $1",
            body.nome_usuario.clone().to_string()
        )
        .fetch_one(pool.get_ref()),
        sqlx::query!(
            "SELECT * FROM kanban.usuarios WHERE email_usuario = $1",
            body.email_usuario.clone().to_string()
        )
        .fetch_one(pool.get_ref())
    );

    if buscar_usuario.is_ok() {
        return ListaErros::ErroUsuarioJaExistente(body.nome_usuario.clone().to_string())
            .as_response();
    }

    if buscar_email.is_ok() {
        return ListaErros::ErroEmailJaExistente(body.email_usuario.clone().to_string())
            .as_response();
    }

    let senha_hash = bcrypt::hash(body.senha.clone().as_ref(), COST);
    if senha_hash.is_err() {
        return ListaErros::ErroInterno.as_response();
    }

    let senha_hash = senha_hash.unwrap();
    registrar_usuario_service(
        body.nome_usuario.clone().as_ref(),
        body.email_usuario.clone().as_ref(),
        senha_hash.as_ref(),
        req.connection_info()
            .realip_remote_addr()
            .map(|ip_str| IpAddr::from_str(ip_str).ok())
            .flatten(),
        pool.get_ref(),
    )
    .await
    .map(|id_usuario| {
        session
            .insert("id_usuario", id_usuario.to_string())
            .unwrap();
        return HttpResponse::Ok().json(json!({
            "idUsuario": id_usuario.to_string(),
        }));
    })
    .unwrap_or_else(|err| err.as_response())
}

#[get("/verificar-login")]
pub async fn verificar_login(pool: web::Data<PgPool>, session: Session) -> impl Responder {
    if let Some(id_usuario) = session.get::<String>("id_usuario").ok().flatten() {
        let quadros = consultar_ids_quadros_usuario(&pool, &id_usuario).await.ok();

        let nome_usuario = query!(
            "
        SELECT nome_usuario FROM kanban.usuarios
        WHERE id_usuario = $1
        ",
            Uuid::parse_str(&id_usuario).unwrap()
        )
        .fetch_one(pool.get_ref())
        .await;

        if let Err(_) = nome_usuario {
            return ListaErros::ErroUsuarioNaoEncontrado(id_usuario).as_response();
        }

        let nome_usuario = nome_usuario.unwrap().nome_usuario;

        HttpResponse::Ok().json(json!({
            "id": id_usuario,
            "nomeUsuario": nome_usuario,
            "quadros": quadros
        }))
    } else {
        ListaErros::ErroUsuarioNaoLogado.as_response()
    }
}
