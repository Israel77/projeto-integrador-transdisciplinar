use sqlx::{query, query_as, types::Uuid};

use crate::{errors::error::ListaErros, persistence::models::coluna::Coluna};

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

pub async fn criar_nova_coluna(
    pool: &sqlx::PgPool,
    id_quadro: &Uuid,
    nome_coluna: &str,
    ordem_coluna: i32,
    id_usuario: &Uuid,
) -> Result<Coluna, ListaErros> {
    let pk_quadro = query!(
        "SELECT pk_quadro FROM kanban.quadros
        WHERE id_quadro = $1",
        id_quadro,
    )
    .fetch_one(pool)
    .await?
    .pk_quadro;

    // Atualiza a ordem de todas as colunas posteriores
    // à que será criada
    query!(
        "UPDATE kanban.colunas
        SET ordem_coluna = ordem_coluna + 1
        WHERE ordem_coluna >= $1
        AND pk_quadro = $2",
        ordem_coluna,
        pk_quadro
    )
    .execute(pool)
    .await?;

    let coluna = query_as!(
        Coluna,
        "INSERT INTO kanban.colunas (pk_quadro, nome_coluna, ordem_coluna, id_usuario)
        SELECT q.pk_quadro, $2, $3, $4
        FROM kanban.quadros q
        WHERE q.id_quadro = $1
        RETURNING *",
        id_quadro,
        nome_coluna,
        ordem_coluna,
        id_usuario
    )
    .fetch_one(pool)
    .await?;

    Ok(coluna)
}
