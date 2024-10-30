use std::sync::Arc;

use sqlx::types::{time::PrimitiveDateTime, Uuid};

#[allow(dead_code)]
pub struct Quadro {
    pub pk_quadro: i32,
    pub id_quadro: Uuid,
    pub id_usuario: Uuid,
    pub titulo_quadro: Arc<str>,
    pub descricao_quadro: Option<String>,
    pub data_criacao_quadro: Option<PrimitiveDateTime>,
}
