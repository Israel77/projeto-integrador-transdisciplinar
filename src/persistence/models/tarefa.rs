use sqlx::types::{time::PrimitiveDateTime, Uuid};

#[allow(dead_code)]
pub struct Tarefa {
    pub pk_tarefa: i32,
    pub id_tarefa: Uuid,
    pub titulo_tarefa: String,
    pub descricao_tarefa: Option<String>,
    pub data_criacao_tarefa: Option<PrimitiveDateTime>,
    pub pk_coluna: Option<i32>,
    pub id_usuario: Uuid,
}
