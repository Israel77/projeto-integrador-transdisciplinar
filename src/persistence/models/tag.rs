use std::sync::Arc;

use sqlx::types::Uuid;

#[allow(dead_code)]
pub struct Tag {
    pub pk_tag: i32,
    pub id_tag: Uuid,
    pub nome_tag: Arc<str>,
}
