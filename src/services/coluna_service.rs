use sqlx::{query, types::Uuid};

use crate::errors::error::ListaErros;

pub async fn consultar_id_por_pk_coluna(
    pool: &sqlx::PgPool,
    pk_coluna: i32,
) -> Result<Uuid, ListaErros> {
    // TODO: Verificar rastreabilidade de erros
    let id = query!(
        "SELECT id_coluna FROM kanban.colunas WHERE pk_coluna=$1",
        pk_coluna
    )
    .fetch_one(pool)
    .await?
    .id_coluna;

    Ok(id)
}

pub async fn consultar_pk_por_id_coluna(
    pool: &sqlx::PgPool,
    id_coluna: &str,
) -> Result<i32, ListaErros> {
    // TODO: Verificar rastreabilidade de erros
    let pk_coluna = query!(
        "SELECT pk_coluna FROM kanban.colunas WHERE id_coluna=$1",
        Uuid::parse_str(id_coluna).unwrap()
    )
    .fetch_one(pool)
    .await?
    .pk_coluna;

    Ok(pk_coluna)
}

pub async fn consultar_quadro_da_coluna(
    pool: &sqlx::PgPool,
    id_coluna: &Uuid,
) -> Result<i32, ListaErros> {
    // TODO: Verificar rastreabilidade de erros
    let pk_quadro = query!(
        "SELECT pk_quadro FROM kanban.colunas WHERE id_coluna=$1",
        id_coluna
    )
    .fetch_one(pool)
    .await?
    .pk_quadro;

    Ok(pk_quadro)
}

pub async fn alterar_nome_coluna(
    pool: &sqlx::PgPool,
    id_coluna: &Uuid,
    novo_nome: &str,
) -> Result<(), ListaErros> {
    // TODO: Verificar rastreabilidade de erros
    let query = query!(
        "UPDATE kanban.colunas SET nome_coluna=$1 WHERE id_coluna=$2",
        novo_nome,
        id_coluna
    )
    .execute(pool)
    .await;

    match query {
        Ok(_) => Ok(()),
        Err(e) => Err(ListaErros::ErroSQL(e)),
    }
}
