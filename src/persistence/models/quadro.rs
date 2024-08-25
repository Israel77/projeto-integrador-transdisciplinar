use sqlx::types::time::PrimitiveDateTime;

pub struct Quadro {
    pub id: i32,
    pub usuario_id: i32,
    pub titulo: String,
    pub descricao: String,
    pub data_criacao: Option<PrimitiveDateTime>,
}
