use std::sync::Arc;

use sqlx::types::time::PrimitiveDateTime;

pub struct Quadro {
    pub id: i32,
    pub usuario_id: i32,
    pub titulo: Arc<str>,
    pub descricao: Option<String>,
    pub data_criacao: Option<PrimitiveDateTime>,
}

impl Quadro {
    pub async fn listar_todos(conn: &sqlx::PgPool) -> Result<Vec<Quadro>, sqlx::Error> {
        sqlx::query_as!(Quadro, "SELECT * FROM kanban.quadros")
            .fetch_all(conn)
            .await
    }
}
