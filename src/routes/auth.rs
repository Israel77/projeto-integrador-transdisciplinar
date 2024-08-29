use std::{net::IpAddr, str::FromStr};

use actix_session::Session;
use actix_web::{post, web, HttpRequest, HttpResponse, Responder};
use serde::{Deserialize, Serialize};

use crate::services::auth_service::{login_service, registrar_usuario_service};

#[derive(Serialize, Deserialize)]
pub struct RequisicaoLogin {
    pub nome_usuario: String,
    pub senha: String,
}

#[derive(Serialize, Deserialize)]
pub struct RequisicaoRegistro {
    pub nome_usuario: String,
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
            .unwrap_or_default(),
        pool.get_ref(),
    )
    .await
    .map(|result| HttpResponse::Ok().json(result))
    .unwrap_or_else(|err| err.as_response())
}
