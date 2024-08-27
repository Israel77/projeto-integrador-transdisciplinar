use std::sync::Arc;

use actix_web::{get, web, HttpResponse, Responder};
use serde::{Deserialize, Serialize};
use sqlx::query_as;

use crate::persistence::models::{self};

#[derive(Serialize, Deserialize)]
struct QuadroDTO {
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
    fn from_model(coluna: models::estado::Coluna, tarefas: Vec<TarefaDTO>) -> Self {
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

#[get("/quadro/{id}")]
async fn retornar_quadros(id: web::Path<i32>, pool: web::Data<sqlx::PgPool>) -> impl Responder {
    let conn = pool.get_ref();

    match consultar_quadro_por_id(conn, id.into_inner()).await {
        Ok(quadro_dto) => HttpResponse::Ok().json(quadro_dto),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

async fn consultar_quadro_por_id(
    conn: &sqlx::PgPool,
    id_quadro: i32,
) -> Result<QuadroDTO, sqlx::Error> {
    let quadro_model = query_as!(
        models::quadro::Quadro,
        "SELECT * FROM kanban.quadros WHERE id_quadro=$1",
        id_quadro
    )
    .fetch_one(conn)
    .await?;

    let estados_models = query_as!(
        models::estado::Coluna,
        "SELECT * FROM kanban.colunas WHERE id_quadro=$1",
        quadro_model.id_quadro
    )
    .fetch_all(conn)
    .await?;

    let mut estados_dto: Vec<ColunaDTO> = Vec::new();
    for estado_model in estados_models {
        let tarefas_models = query_as!(
            models::tarefa::Tarefa,
            "SELECT * FROM kanban.tarefas WHERE id_coluna=$1",
            estado_model.id_coluna
        )
        .fetch_all(conn)
        .await?;

        let mut tarefas_dto: Vec<TarefaDTO> = vec![];
        for tarefa_model in tarefas_models {
            let tags_models = query_as!(
                models::tag::Tag,
                "SELECT * FROM kanban.tags WHERE id_tag IN (SELECT id_tag FROM kanban.tarefas_tags WHERE id_tarefa=$1)",
                tarefa_model.id_tarefa
            )
            .fetch_all(conn)
            .await?;

            tarefas_dto.push(TarefaDTO::from_model(tarefa_model, &tags_models));
        }

        estados_dto.push(ColunaDTO::from_model(estado_model, tarefas_dto));
    }

    Ok(QuadroDTO::from_model(quadro_model, estados_dto))
}
