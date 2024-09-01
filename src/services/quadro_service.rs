use std::sync::Arc;

use serde::{Deserialize, Serialize};
use sqlx::query_as;

use crate::{errors::error::ListaErros, persistence::models};

#[derive(Serialize, Deserialize)]
pub struct QuadroDTO {
    #[serde(rename = "idQuadro")]
    id_quadro: i32,
    titulo: Arc<str>,
    descricao: Option<String>,
    colunas: Vec<ColunaDTO>,
}

impl QuadroDTO {
    fn from_model(quadro: models::quadro::Quadro, colunas: Vec<ColunaDTO>) -> Self {
        QuadroDTO {
            id_quadro: quadro.id_quadro,
            titulo: quadro.titulo_quadro.clone(),
            descricao: quadro.descricao_quadro,
            colunas,
        }
    }
}

#[derive(Serialize, Deserialize)]
struct ColunaDTO {
    #[serde(rename = "idEstado")]
    id_estado: i32,
    #[serde(rename = "nomeEstado")]
    titulo: String,
    #[serde(rename = "ordemEstado")]
    ordem: i32,
    tarefas: Vec<TarefaDTO>,
}

impl ColunaDTO {
    fn from_model(coluna: models::coluna::Coluna, tarefas: Vec<TarefaDTO>) -> Self {
        ColunaDTO {
            id_estado: coluna.id_coluna,
            titulo: coluna.nome_coluna,
            ordem: coluna.ordem_coluna,
            tarefas,
        }
    }
}

#[derive(Serialize, Deserialize)]
struct TarefaDTO {
    id: i32,
    titulo: String,
    descricao: Option<String>,
    #[serde(rename = "idEstado")]
    estado_id: Option<i32>,
    tags: Vec<Arc<str>>,
}

impl TarefaDTO {
    fn from_model(tarefa: models::tarefa::Tarefa, tags: &Vec<models::tag::Tag>) -> Self {
        TarefaDTO {
            id: tarefa.id_tarefa,
            titulo: tarefa.titulo_tarefa,
            descricao: tarefa.descricao_tarefa,
            estado_id: tarefa.id_coluna,
            tags: tags.iter().map(|model| model.nome_tag.clone()).collect(),
        }
    }
}

pub async fn consultar_quadro_por_id(
    pool: &sqlx::PgPool,
    id_quadro: i32,
    id_usuario: i32,
) -> Result<QuadroDTO, ListaErros> {
    let quadro_model = query_as!(
        models::quadro::Quadro,
        "SELECT * FROM kanban.quadros WHERE id_quadro=$1",
        id_quadro
    )
    .fetch_one(pool)
    .await?;

    if quadro_model.id_usuario != id_usuario {
        return Err(ListaErros::ErroUsuarioNaoAutorizado(id_usuario.to_string()));
    }

    let estados_models = query_as!(
        models::coluna::Coluna,
        "SELECT * FROM kanban.colunas WHERE id_quadro=$1",
        quadro_model.id_quadro
    )
    .fetch_all(pool)
    .await?;

    let mut estados_dto: Vec<ColunaDTO> = Vec::new();
    for estado_model in estados_models {
        let tarefas_models = query_as!(
            models::tarefa::Tarefa,
            "SELECT * FROM kanban.tarefas WHERE id_coluna=$1",
            estado_model.id_coluna
        )
        .fetch_all(pool)
        .await?;

        let mut tarefas_dto: Vec<TarefaDTO> = vec![];
        for tarefa_model in tarefas_models {
            let tags_models = query_as!(
                models::tag::Tag,
                "SELECT * FROM kanban.tags WHERE id_tag IN (SELECT id_tag FROM kanban.tarefas_tags WHERE id_tarefa=$1)",
                tarefa_model.id_tarefa
            )
            .fetch_all(pool)
            .await?;

            tarefas_dto.push(TarefaDTO::from_model(tarefa_model, &tags_models));
        }

        estados_dto.push(ColunaDTO::from_model(estado_model, tarefas_dto));
    }

    Ok(QuadroDTO::from_model(quadro_model, estados_dto))
}

pub async fn consultar_ids_quadros_usuario(
    pool: &sqlx::PgPool,
    id_usuario: i32,
) -> Result<Vec<i32>, ListaErros> {
    struct QuadroId {
        id_quadro: i32,
    }

    query_as!(
        QuadroId,
        "SELECT id_quadro FROM kanban.quadros WHERE id_usuario=$1",
        id_usuario,
    )
    .fetch_all(pool)
    .await
    .map(|quadros| Ok(quadros.iter().map(|quadro| quadro.id_quadro).collect()))?
}
