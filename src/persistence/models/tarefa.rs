use sqlx::types::time::PrimitiveDateTime;

pub struct Tarefa {
    pub id: i32,
    pub quadro_id: i32,
    pub titulo: String,
    pub descricao: Option<String>,
    pub data_criacao: Option<PrimitiveDateTime>,
    pub estado_id: Option<i32>,
}

impl Tarefa {
    pub async fn listar_todas(conn: &sqlx::PgPool) -> Result<Vec<Tarefa>, sqlx::Error> {
        sqlx::query_as!(Tarefa, "SELECT * FROM kanban.tarefas")
            .fetch_all(conn)
            .await
    }
}
