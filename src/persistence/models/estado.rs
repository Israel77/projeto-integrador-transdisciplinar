pub struct Estado {
    pub id: i32,
    pub quadro_id: i32,
    pub nome_estado: String,
    pub ordem: i32,
}

impl Estado {
    pub async fn listar_todos(conn: &sqlx::PgPool) -> Result<Vec<Estado>, sqlx::Error> {
        sqlx::query_as!(Estado, "SELECT * FROM kanban.estados")
            .fetch_all(conn)
            .await
    }
}
