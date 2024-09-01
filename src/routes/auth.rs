use std::{net::IpAddr, str::FromStr};

use actix_session::Session;
use actix_web::{get, post, web, HttpRequest, HttpResponse, Responder};
use serde::{Deserialize, Serialize};
use serde_json::json;
use sqlx::PgPool;

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
    pub nome_usuario: String,
    #[serde(rename = "emailUsuario")]
    pub email_usuario: String,
    pub senha: String,
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
) -> impl Responder {
    registrar_usuario_service(
        body.nome_usuario.clone(),
        body.email_usuario.clone(),
        body.senha.clone(),
        req.connection_info()
            .realip_remote_addr()
            .map(|ip_str| IpAddr::from_str(ip_str).ok())
            .flatten(),
        pool.get_ref(),
    )
    .await
    .map(|result| HttpResponse::Ok().json(result))
    .unwrap_or_else(|err| err.as_response())
}

#[get("/verificar-login")]
pub async fn verificar_login(pool: web::Data<PgPool>, session: Session) -> impl Responder {
    if let Some(id_usuario) = session.get::<i32>("id_usuario").ok().flatten() {
        let quadros = consultar_ids_quadros_usuario(&pool, id_usuario).await.ok();
        HttpResponse::Ok().json(json!({"id": id_usuario, "quadros": quadros}))
    } else {
        ListaErros::ErroUsuarioNaoLogado.as_response()
    }
}
