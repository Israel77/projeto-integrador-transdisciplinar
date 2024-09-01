use std::sync::Arc;

use sqlx::types::time::PrimitiveDateTime;

#[allow(dead_code)]
pub struct Quadro {
    pub id_quadro: i32,
    pub id_usuario: i32,
    pub titulo_quadro: Arc<str>,
    pub descricao_quadro: Option<String>,
    pub data_criacao_quadro: Option<PrimitiveDateTime>,
}
