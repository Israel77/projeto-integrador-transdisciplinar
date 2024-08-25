use sqlx::{
    prelude::FromRow,
    types::{ipnetwork::IpNetwork, time::PrimitiveDateTime},
    PgPool,
};

#[derive(Debug, FromRow)]
pub struct Usuario {
    pub id: i32,
    pub nome_usuario: String,
    pub email: String,
    pub senha_hash: String,
    pub data_criacao: Option<PrimitiveDateTime>,
    pub ip_criacao: Option<IpNetwork>,
}

impl Usuario {
    pub async fn listar_todos(pool: &PgPool) -> Result<Vec<Usuario>, sqlx::Error> {
        sqlx::query_as!(Usuario, "SELECT * FROM kanban.usuarios")
            .fetch_all(pool)
            .await
    }

    pub async fn procurar_por_id(pool: &PgPool, id: i32) -> Result<Usuario, sqlx::Error> {
        sqlx::query_as!(Usuario, "SELECT * FROM kanban.usuarios WHERE id = $1", id)
            .fetch_one(pool)
            .await
    }
}
