use sqlx::types::Uuid;

#[allow(dead_code)]
pub struct Coluna {
    pub pk_coluna: i32,
    pub id_coluna: Uuid,
    pub pk_quadro: i32,
    pub nome_coluna: String,
    pub ordem_coluna: i32,
    pub id_usuario: Uuid,
}
