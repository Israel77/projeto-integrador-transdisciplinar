pub struct Tag {
    pub id: i32,
    pub nome: String,
}

impl Tag {
    pub async fn listar_todas(conn: &sqlx::PgPool) -> Result<Vec<Tag>, sqlx::Error> {
        sqlx::query_as!(Tag, "SELECT * FROM kanban.tags")
            .fetch_all(conn)
            .await
    }
}
