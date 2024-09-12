use std::sync::Arc;

use futures::join;
use serde::{Deserialize, Serialize};
use sqlx::{query, types::Uuid};

use crate::{
    errors::error::ListaErros,
    persistence::models::{self, tag, tarefa},
};

#[derive(Serialize, Deserialize)]
pub struct TarefaDTO {
    id: String,
    titulo: String,
    descricao: Option<String>,
    #[serde(rename = "idColuna")]
    id_coluna: Option<Arc<str>>,
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
) -> Result<Uuid, ListaErros> {
    struct DadosTarefa(Uuid, i32);
    let dados_tarefa = query!(
        "INSERT INTO kanban.tarefas (titulo_tarefa, descricao_tarefa, pk_coluna) VALUES ($1, $2, $3) RETURNING id_tarefa, pk_tarefa",
        titulo,
        descricao,
        pk_coluna)
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
