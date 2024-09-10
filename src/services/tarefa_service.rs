use std::sync::Arc;

use serde::{Deserialize, Serialize};
use sqlx::types::Uuid;

use crate::persistence::models;

#[derive(Serialize, Deserialize)]
pub struct TarefaDTO {
    id: String,
    titulo: String,
    descricao: Option<String>,
    #[serde(rename = "idEstado")]
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
