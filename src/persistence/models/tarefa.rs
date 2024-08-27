use sqlx::types::time::PrimitiveDateTime;

pub struct Tarefa {
    pub id_tarefa: i32,
    pub titulo_tarefa: String,
    pub descricao_tarefa: Option<String>,
    pub data_criacao_tarefa: Option<PrimitiveDateTime>,
    pub id_coluna: Option<i32>,
    pub id_quadro: i32,
}
