use std::sync::Arc;

use futures::join;
use serde::{Deserialize, Serialize};
use sqlx::{query, query_as, types::Uuid};

use crate::{errors::error::ListaErros, persistence::models};

use super::tarefa_service::TarefaDTO;

#[derive(Serialize, Deserialize)]
pub struct QuadroDTO {
    #[serde(rename = "idQuadro")]
    id_quadro: String,
    titulo: Arc<str>,
    descricao: Option<String>,
    colunas: Vec<ColunaDTO>,
}

impl QuadroDTO {
    fn from_model(quadro: &models::quadro::Quadro, colunas: Vec<ColunaDTO>) -> Self {
        QuadroDTO {
            id_quadro: quadro.id_quadro.to_string(),
            titulo: quadro.titulo_quadro.clone(),
            descricao: quadro.descricao_quadro.clone(),
            colunas,
        }
    }
}

#[derive(Serialize, Deserialize)]
struct ColunaDTO {
    #[serde(rename = "idColuna")]
    id_coluna: String,
    #[serde(rename = "nomeColuna")]
    titulo: String,
    #[serde(rename = "ordemColuna")]
    ordem: i32,
    tarefas: Vec<TarefaDTO>,
}

impl ColunaDTO {
    fn from_model(coluna: models::coluna::Coluna, tarefas: Vec<TarefaDTO>) -> Self {
        ColunaDTO {
            id_coluna: coluna.id_coluna.to_string(),
            titulo: coluna.nome_coluna,
            ordem: coluna.ordem_coluna,
            tarefas,
        }
    }
}

pub async fn consultar_quadro_por_id(
    pool: &sqlx::PgPool,
    id_quadro: &str,
    id_usuario: &str,
) -> Result<QuadroDTO, ListaErros> {
    struct PkUsuario {
        pk_usuario: i32,
    }

    // TODO: Substituir por uma consulta com JOIN
    let (quadro_model, id_usuario) = join!(
        query_as!(
            models::quadro::Quadro,
            "SELECT * FROM kanban.quadros WHERE id_quadro=$1",
            Uuid::parse_str(id_quadro).unwrap()
        )
        .fetch_one(pool),
        query_as!(
            PkUsuario,
            "SELECT pk_usuario FROM kanban.usuarios WHERE id_usuario=$1",
            Uuid::parse_str(id_usuario).unwrap()
        )
        .fetch_one(pool)
    );

    let quadro_model = quadro_model?;
    let id_usuario = id_usuario?;

    if quadro_model.pk_usuario.to_string() != id_usuario.pk_usuario.to_string() {
        return Err(ListaErros::ErroUsuarioNaoAutorizado(
            id_usuario.pk_usuario.to_string(),
        ));
    }

    let colunas_models = query_as!(
        models::coluna::Coluna,
        "SELECT * FROM kanban.colunas WHERE pk_quadro=$1 ORDER BY pk_coluna",
        quadro_model.pk_quadro
    )
    .fetch_all(pool)
    .await?;

    let mut colunas_dto: Vec<ColunaDTO> = Vec::new();
    for coluna_model in colunas_models {
        let tarefas_models = query_as!(
            models::tarefa::Tarefa,
            "SELECT * FROM kanban.tarefas WHERE pk_coluna=$1 ORDER BY pk_tarefa",
            coluna_model.pk_coluna
        )
        .fetch_all(pool)
        .await?;

        let mut tarefas_dto: Vec<TarefaDTO> = vec![];
        for tarefa_model in tarefas_models {
            let tags_models = query_as!(
                models::tag::Tag,
                "SELECT * FROM kanban.tags WHERE pk_tag IN (SELECT pk_tag FROM kanban.tarefas_tags WHERE pk_tarefa=$1)",
                tarefa_model.pk_tarefa
            )
            .fetch_all(pool)
            .await?;

            tarefas_dto.push(TarefaDTO::from_model(
                tarefa_model,
                Some(coluna_model.id_coluna),
                &tags_models,
            ));
        }

        colunas_dto.push(ColunaDTO::from_model(coluna_model, tarefas_dto));
    }

    Ok(QuadroDTO::from_model(&quadro_model, colunas_dto))
}

pub async fn consultar_ids_quadros_usuario(
    pool: &sqlx::PgPool,
    id_usuario: &str,
) -> Result<Vec<String>, ListaErros> {
    struct QuadroId {
        id_quadro: Uuid,
    }

    query_as!(
        QuadroId,
        "SELECT id_quadro FROM kanban.quadros WHERE pk_usuario IN (SELECT pk_usuario FROM kanban.usuarios WHERE id_usuario=$1)",
        Uuid::parse_str(id_usuario).unwrap(),
    )
    .fetch_all(pool)
    .await
    .map(|quadros| {
        Ok(quadros
            .iter()
            .map(|quadro| quadro.id_quadro.to_string())
            .collect())
    })?
}

pub async fn verificar_quadro_pertence_ao_usuario(
    pool: &sqlx::PgPool,
    id_quadro: &str,
    id_usuario: &str,
) -> Result<(), ListaErros> {
    let consulta = query!(
        "SELECT q.pk_usuario
        FROM kanban.quadros q
        INNER JOIN kanban.usuarios u
        ON q.pk_usuario = u.pk_usuario
        WHERE
        id_quadro=$1 AND
        u.id_usuario=$2;",
        Uuid::parse_str(id_quadro).unwrap(),
        Uuid::parse_str(id_usuario).unwrap(),
    )
    .fetch_optional(pool)
    .await?;

    consulta
        .map(|_| ())
        .ok_or(ListaErros::ErroUsuarioNaoAutorizado(
            Uuid::parse_str(id_usuario).unwrap().to_string(),
        ))
}
