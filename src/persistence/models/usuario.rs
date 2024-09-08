use sqlx::{
    prelude::FromRow,
    types::{ipnetwork::IpNetwork, time::PrimitiveDateTime, Uuid},
};

#[derive(Debug, FromRow)]
#[allow(dead_code)]
pub struct Usuario {
    pub pk_usuario: i32,
    pub id_usuario: Uuid,
    pub nome_usuario: String,
    pub email_usuario: String,
    pub senha_hash_usuario: String,
    pub data_criacao_usuario: Option<PrimitiveDateTime>,
    pub ip_criacao_usuario: Option<IpNetwork>,
}
