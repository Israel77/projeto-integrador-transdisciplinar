use std::sync::Arc;

use sqlx::types::time::PrimitiveDateTime;

pub struct Quadro {
    pub id: i32,
    pub usuario_id: i32,
    pub titulo: Arc<str>,
    pub descricao: Option<String>,
    pub data_criacao: Option<PrimitiveDateTime>,
}
