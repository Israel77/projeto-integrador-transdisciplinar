pub struct Coluna {
    pub id_coluna: i32,
    pub id_quadro: i32,
    pub nome_coluna: String,
    pub ordem_coluna: i32,
}

impl Coluna {
    pub async fn listar_todos(conn: &sqlx::PgPool) -> Result<Vec<Coluna>, sqlx::Error> {
        sqlx::query_as!(Coluna, "SELECT * FROM kanban.colunas")
            .fetch_all(conn)
            .await
    }
}
