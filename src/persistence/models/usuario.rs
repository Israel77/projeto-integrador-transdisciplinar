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
