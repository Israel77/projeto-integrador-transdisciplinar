use std::sync::Arc;

use futures::join;
use serde::{Deserialize, Serialize};
use sqlx::{query, query_as, types::Uuid};

use crate::{
    errors::error::ListaErros,
    persistence::models::{self, tag::Tag},
};

#[derive(Serialize, Deserialize)]
pub struct TarefaDTO {
    id: String,
    titulo: String,
    descricao: Option<String>,
    #[serde(rename = "idColuna")]
    id_coluna: Option<Arc<str>>,
    prioridade: i16,
    tags: Vec<Arc<str>>,
}

impl TarefaDTO {
    pub fn from_model(
        tarefa: models::tarefa::Tarefa,
        id_coluna: Option<Uuid>,
        tags: &Vec<models::tag::Tag>,
    ) -> Self {
        TarefaDTO {
            id: tarefa.id_tarefa.to_string(),
            titulo: tarefa.titulo_tarefa,
            descricao: tarefa.descricao_tarefa,
            id_coluna: id_coluna.map(|id| Arc::from(id.to_string())),
            prioridade: tarefa.prioridade,
            tags: tags.iter().map(|model| model.nome_tag.clone()).collect(),
        }
    }
}

pub async fn gravar_nova_tarefa(
    pool: &sqlx::PgPool,
    titulo: &str,
    descricao: Option<&str>,
    pk_coluna: i32,
    tags: Vec<i32>,
    id_usuario: Uuid,
) -> Result<Uuid, ListaErros> {
    let dados_tarefa = query!(
        "INSERT INTO kanban.tarefas (titulo_tarefa, descricao_tarefa, pk_coluna, id_usuario)
        VALUES ($1, $2, $3, $4) 
        RETURNING id_tarefa, pk_tarefa",
        titulo,
        descricao,
        pk_coluna,
        id_usuario
    )
    .fetch_one(pool)
    .await?;

    for tag in tags {
        query!(
            "INSERT INTO kanban.tarefas_tags (pk_tarefa, pk_tag) VALUES ($1, $2)",
            dados_tarefa.pk_tarefa,
            tag
        )
        .execute(pool)
        .await?;
    }

    Ok(dados_tarefa.id_tarefa)
}

pub async fn consultar_dados_tarefa(
    pool: &sqlx::PgPool,
    id_tarefa: &Uuid,
) -> Result<TarefaDTO, ListaErros> {
    let tarefa = query_as!(
        models::tarefa::Tarefa,
        "SELECT * FROM kanban.tarefas WHERE id_tarefa=$1",
        id_tarefa
    )
    .fetch_one(pool)
    .await?;

    let (id_coluna, tags) = join!(
        consultar_id_coluna_tarefa(pool, id_tarefa),
        consultar_tags_tarefa(pool, id_tarefa)
    );

    Ok(TarefaDTO::from_model(
        tarefa,
        id_coluna.ok(),
        &tags.unwrap_or_default(),
    ))
}

pub async fn editar_tarefa(
    pool: &sqlx::PgPool,
    id_tarefa: &Uuid,
    titulo: &str,
    descricao: Option<&str>,
    id_coluna: i32,
    tags: Vec<i32>,
) -> Result<(), ListaErros> {
    let pk_tarefa = consultar_pk_por_id_tarefa(pool, id_tarefa).await?;

    query!(
        "UPDATE kanban.tarefas SET titulo_tarefa=$1, descricao_tarefa=$2, pk_coluna=$3 WHERE id_tarefa=$4",
        titulo,
        descricao,
        id_coluna,
        id_tarefa
    )
    .execute(pool)
    .await?;

    // TODO: Verificar possibilidade de melhoria de performance
    query!(
        "DELETE FROM kanban.tarefas_tags WHERE pk_tarefa IN (SELECT pk_tarefa FROM kanban.tarefas WHERE id_tarefa=$1)",
        id_tarefa
    )
    .execute(pool)
    .await?;

    for tag in tags {
        query!(
            "INSERT INTO kanban.tarefas_tags (pk_tarefa, pk_tag) VALUES ($1, $2)",
            pk_tarefa,
            tag
        )
        .execute(pool)
        .await?;
    }

    Ok(())
}

pub async fn apagar_tarefa(pool: &sqlx::PgPool, id_tarefa: &Uuid) -> Result<(), ListaErros> {
    // Assume que as tabelas com dependência nas tarefas possuem regra de CASCADE,
    // caso contrário, devem ser criadas triggers para deletar os registros dependentes
    // ou inserir queries para deletar os registros dependentes
    query!("DELETE FROM kanban.tarefas WHERE id_tarefa=$1", id_tarefa)
        .execute(pool)
        .await?;

    Ok(())
}

// TODO: Implementar cache
pub async fn consultar_pk_por_id_tarefa(
    pool: &sqlx::PgPool,
    id_tarefa: &Uuid,
) -> Result<i32, ListaErros> {
    // TODO: Verificar rastreabilidade de erros
    let pk_tarefa = query!(
        "SELECT pk_tarefa FROM kanban.tarefas WHERE id_tarefa=$1",
        id_tarefa
    )
    .fetch_one(pool)
    .await?
    .pk_tarefa;

    Ok(pk_tarefa)
}

pub async fn editar_titulo_tarefa(
    pool: &sqlx::PgPool,
    id_tarefa: &Uuid,
    titulo: &str,
) -> Result<(), ListaErros> {
    query!(
        "UPDATE kanban.tarefas SET titulo_tarefa=$1 WHERE id_tarefa=$2",
        titulo,
        id_tarefa
    )
    .execute(pool)
    .await?;

    Ok(())
}

pub async fn editar_descricao_tarefa(
    pool: &sqlx::PgPool,
    id_tarefa: &Uuid,
    descricao: Option<&str>,
) -> Result<(), ListaErros> {
    query!(
        "UPDATE kanban.tarefas SET descricao_tarefa=$1 WHERE id_tarefa=$2",
        descricao,
        id_tarefa
    )
    .execute(pool)
    .await?;

    Ok(())
}

pub async fn editar_coluna_tarefa(
    pool: &sqlx::PgPool,
    id_tarefa: &Uuid,
    id_coluna: &Uuid,
) -> Result<(), ListaErros> {
    query!(
        "UPDATE kanban.tarefas t SET
        pk_coluna=c.pk_coluna
        FROM kanban.colunas c
        WHERE c.id_coluna=$1 AND t.id_tarefa=$2",
        id_coluna,
        id_tarefa
    )
    .execute(pool)
    .await?;

    Ok(())
}

async fn consultar_id_coluna_tarefa(
    pool: &sqlx::PgPool,
    id_tarefa: &Uuid,
) -> Result<Uuid, ListaErros> {
    Ok(query!(
        "SELECT c.id_coluna FROM kanban.tarefas t INNER JOIN kanban.colunas c ON t.pk_coluna = c.pk_coluna WHERE id_tarefa=$1",
        id_tarefa
    )
    .fetch_one(pool)
    .await?
    .id_coluna)
}

async fn consultar_tags_tarefa(
    pool: &sqlx::PgPool,
    id_tarefa: &Uuid,
) -> Result<Vec<Tag>, ListaErros> {
    Ok(query_as!(
        models::tag::Tag,
        "
        SELECT t.*
        FROM kanban.tarefas_tags tt
        INNER JOIN kanban.tags t ON tt.pk_tag = t.pk_tag
        WHERE tt.pk_tarefa = (SELECT pk_tarefa FROM kanban.tarefas WHERE id_tarefa=$1)
        ",
        id_tarefa
    )
    .fetch_all(pool)
    .await?)
}
