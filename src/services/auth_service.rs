use std::net::IpAddr;

use actix_session::Session;
use bcrypt::verify;
use futures::join;
use sqlx::{query, types::ipnetwork::IpNetwork};

use crate::{errors::error::ListaErros, persistence::models::usuario::Usuario};

pub async fn login_service(
    nome_usuario: String,
    senha: String,
    pool: &sqlx::PgPool,
    session: Session,
) -> Result<String, ListaErros> {
    let dados_usuario = sqlx::query_as!(
        Usuario,
        "SELECT * FROM kanban.usuarios WHERE nome_usuario = $1",
        nome_usuario,
    )
    .fetch_one(pool)
    .await;

    match dados_usuario {
        Ok(dados_usuario) => {
            if verify(senha, &dados_usuario.senha_hash_usuario).is_ok_and(|result| result) {
                session
                    .insert("id_usuario", dados_usuario.id_usuario)
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
    nome_usuario: String,
    email_usuario: String,
    senha: String,
    ip_usuario: Option<IpAddr>,
    pool: &sqlx::PgPool,
) -> Result<String, ListaErros> {
    const COMPRIMENTO_MIN_SENHA: usize = 8;
    const COST: u32 = bcrypt::DEFAULT_COST;

    if senha.len() < COMPRIMENTO_MIN_SENHA {
        return Err(ListaErros::ErroSenhaCurta);
    }

    let (buscar_usuario, buscar_email) = join!(
        sqlx::query_as!(
            Usuario,
            "SELECT * FROM kanban.usuarios WHERE nome_usuario = $1",
            nome_usuario
        )
        .fetch_one(pool),
        sqlx::query_as!(
            Usuario,
            "SELECT * FROM kanban.usuarios WHERE email_usuario = $1",
            email_usuario
        )
        .fetch_one(pool)
    );

    if buscar_usuario.is_ok() {
        return Err(ListaErros::ErroUsuarioJaExistente(nome_usuario));
    }

    if buscar_email.is_ok() {
        return Err(ListaErros::ErroEmailJaExistente(email_usuario));
    }

    let senha_hash = bcrypt::hash(senha, COST);
    if senha_hash.is_err() {
        return Err(ListaErros::ErroInterno);
    }

    let senha_hash = senha_hash.unwrap();
    match query!(
        "INSERT INTO kanban.usuarios (nome_usuario, email_usuario, senha_hash_usuario, ip_criacao_usuario) VALUES ($1, $2, $3, $4)",
        nome_usuario,
        email_usuario,
        senha_hash,
        ip_usuario.map(|ip_std| IpNetwork::from(ip_std))
    )
    .execute(pool)
    .await {
        Ok(_) => Ok(format!("Usuário {} registrado com sucesso", nome_usuario)),
        Err(e) => Err(ListaErros::ErroSQL(e)),
    }
}
