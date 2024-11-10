use std::net::IpAddr;

use actix_session::Session;
use bcrypt::verify;
use futures::join;
use sqlx::{
    query,
    types::{ipnetwork::IpNetwork, Uuid},
};

use crate::{errors::error::ListaErros, persistence::models::usuario::Usuario};

pub async fn login_service(
    nome_usuario: String,
    senha: String,
    pool: &sqlx::PgPool,
    session: Session,
) -> Result<String, ListaErros> {
    let dados_usuario = sqlx::query!(
        "SELECT id_usuario, senha_hash_usuario FROM kanban.usuarios WHERE nome_usuario = $1",
        nome_usuario,
    )
    .fetch_one(pool)
    .await;

    match dados_usuario {
        Ok(dados_usuario) => {
            if verify(senha, &dados_usuario.senha_hash_usuario).is_ok_and(|result| result) {
                session
                    .insert("id_usuario", dados_usuario.id_usuario.to_string())
                    .unwrap();
                Ok(format!("Usuário {} logado com sucesso", nome_usuario))
            } else {
                Err(ListaErros::ErroAuteticacao)
            }
        }
        Err(sqlx::Error::RowNotFound) => Err(ListaErros::ErroUsuarioNaoEncontrado(nome_usuario)),
        Err(e) => Err(ListaErros::ErroSQL(e)),
    }
}

pub async fn registrar_usuario_service(
    nome_usuario: &str,
    email_usuario: &str,
    senha_hash: &str,
    ip_usuario: Option<IpAddr>,
    pool: &sqlx::PgPool,
) -> Result<Uuid, ListaErros> {
    match query!(
        "INSERT INTO kanban.usuarios (nome_usuario, email_usuario, senha_hash_usuario, ip_criacao_usuario)
         VALUES ($1, $2, $3, $4)
         RETURNING id_usuario",
        nome_usuario,
        email_usuario,
        senha_hash,
        ip_usuario.map(|ip_std| IpNetwork::from(ip_std))
    )
    .fetch_one(pool)
    .await {
        Ok(row) => Ok(row.id_usuario),
        Err(e) => Err(ListaErros::ErroSQL(e)),
    }
}
