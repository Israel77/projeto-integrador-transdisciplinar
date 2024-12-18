use std::{sync::Arc, vec};

use actix_session::Session;
use actix_web::{delete, get, put, web, HttpResponse, Responder};
use serde::Deserialize;
use sqlx::types::Uuid;

use crate::{
    errors::error::ListaErros,
    services::{
        coluna_service::consultar_pk_por_id_coluna,
        tarefa_service::{
            apagar_tarefa, consultar_dados_tarefa, editar_coluna_tarefa, editar_descricao_tarefa,
            editar_tarefa, editar_titulo_tarefa, gravar_nova_tarefa,
        },
    },
};

#[derive(Deserialize)]
struct AtualizarTarefaDTO {
    #[serde(rename = "idTarefa")]
    id_tarefa: String,
    titulo: String,
    descricao: Option<String>,
    #[serde(rename = "idColuna")]
    id_coluna: Option<String>,
    prioridade: i16,
}

#[derive(Deserialize)]
struct AtualizarTituloTarefaDTO {
    #[serde(rename = "idTarefa")]
    id_tarefa: String,
    titulo: String,
}

#[derive(Deserialize)]
struct AtualizarDescricaoTarefaDTO {
    #[serde(rename = "idTarefa")]
    id_tarefa: String,
    descricao: Option<String>,
}

#[derive(Deserialize)]
struct AtualizarColunaTarefaDTO {
    #[serde(rename = "idTarefa")]
    id_tarefa: Arc<str>,
    #[serde(rename = "idColuna")]
    id_coluna: Arc<str>,
}

#[derive(Deserialize)]
struct CriarTarefaDTO {
    titulo: String,
    descricao: Option<String>,
    #[serde(rename = "idColuna")]
    id_coluna: Option<String>,
    prioridade: Option<i16>,
}

#[get("/tarefa/{id_tarefa}")]
pub async fn obter_dados_tarefa(
    id_tarefa: web::Path<String>,
    pool: web::Data<sqlx::PgPool>,
    session: Session,
) -> impl Responder {
    //TODO: Analisar a necessidade de validar se a tarefa pertence ao usuário logado
    if session.get::<String>("id_usuario").is_err() {
        return ListaErros::ErroUsuarioNaoLogado.as_response();
    }

    let id_tarefa = Uuid::parse_str(id_tarefa.as_str()).unwrap();

    consultar_dados_tarefa(&pool, &id_tarefa)
        .await
        .map(|tarefa| HttpResponse::Ok().json(tarefa))
        .unwrap_or_else(|err| err.as_response())
}

#[delete("/tarefa/{id_tarefa}")]
pub async fn deletar_tarefa(
    id_tarefa: web::Path<String>,
    pool: web::Data<sqlx::PgPool>,
    session: Session,
) -> impl Responder {
    //TODO: Analisar a necessidade de validar se a tarefa pertence ao usuário logado
    if session.get::<String>("id_usuario").is_err() {
        return ListaErros::ErroUsuarioNaoLogado.as_response();
    }

    apagar_tarefa(&pool, &Uuid::parse_str(id_tarefa.as_str()).unwrap())
        .await
        .map(|_| HttpResponse::Ok().json("Ok"))
        .unwrap_or_else(|err| err.as_response())
}

#[put("/tarefa/atualizar")]
pub async fn atualizar_tarefa(
    dados_tarefa: web::Json<AtualizarTarefaDTO>,
    pool: web::Data<sqlx::PgPool>,
    session: Session,
) -> impl Responder {
    //TODO: Analisar a necessidade de validar se a tarefa pertence ao usuário logado
    if session.get::<String>("id_usuario").is_err() {
        return ListaErros::ErroUsuarioNaoLogado.as_response();
    }

    let resultado_pk_coluna = consultar_pk_por_id_coluna(
        &pool,
        dados_tarefa
            .id_coluna
            .as_ref()
            .map(|id_coluna| id_coluna.as_str())
            .unwrap(),
    )
    .await;

    if let Ok(pk_coluna) = resultado_pk_coluna {
        // FIXME: Implementar a edição de tags
        let resultado = editar_tarefa(
            &pool,
            &Uuid::parse_str(&dados_tarefa.id_tarefa).unwrap(),
            &dados_tarefa.titulo,
            dados_tarefa
                .descricao
                .as_ref()
                .map(|descricao| descricao.as_str()),
            pk_coluna,
            dados_tarefa.prioridade,
            vec![],
        )
        .await;

        if let Ok(_) = resultado {
            HttpResponse::Ok().json("Ok")
        } else {
            resultado.unwrap_err().as_response()
        }
    } else {
        resultado_pk_coluna.unwrap_err().as_response()
    }
}

#[put("/tarefa/atualizar/titulo")]
pub async fn atualizar_titulo_tarefa(
    dados_tarefa: web::Json<AtualizarTituloTarefaDTO>,
    pool: web::Data<sqlx::PgPool>,
    session: Session,
) -> impl Responder {
    //TODO: Analisar a necessidade de validar se a tarefa pertence ao usuário logado
    if session.get::<String>("id_usuario").is_err() {
        return ListaErros::ErroUsuarioNaoLogado.as_response();
    }

    let resultado = editar_titulo_tarefa(
        &pool,
        &Uuid::parse_str(&dados_tarefa.id_tarefa).unwrap(),
        &dados_tarefa.titulo,
    )
    .await;

    if let Ok(_) = resultado {
        HttpResponse::Ok().json("Ok")
    } else {
        resultado.unwrap_err().as_response()
    }
}

#[put("/tarefa/atualizar/descricao")]
pub async fn atualizar_descricao_tarefa(
    dados_tarefa: web::Json<AtualizarDescricaoTarefaDTO>,
    pool: web::Data<sqlx::PgPool>,
    session: Session,
) -> impl Responder {
    //TODO: Analisar a necessidade de validar se a tarefa pertence ao usuário logado
    if session.get::<String>("id_usuario").is_err() {
        return ListaErros::ErroUsuarioNaoLogado.as_response();
    }

    let resultado = editar_descricao_tarefa(
        &pool,
        &Uuid::parse_str(&dados_tarefa.id_tarefa).unwrap(),
        dados_tarefa
            .descricao
            .as_ref()
            .map(|descricao| descricao.as_str()),
    )
    .await;

    if let Ok(_) = resultado {
        HttpResponse::Ok().json("Ok")
    } else {
        resultado.unwrap_err().as_response()
    }
}

#[put("/tarefa/atualizar/coluna")]
pub async fn atualizar_coluna_tarefa(
    dados_tarefa: web::Json<AtualizarColunaTarefaDTO>,
    pool: web::Data<sqlx::PgPool>,
    session: Session,
) -> impl Responder {
    // TODO: Validar se tarefa pertence ao usuário logado
    if session.get::<String>("id_usuario").is_err() {
        return ListaErros::ErroUsuarioNaoLogado.as_response();
    }

    let id_tarefa = Uuid::parse_str(&dados_tarefa.id_tarefa.clone()).unwrap();
    let id_coluna = Uuid::parse_str(&dados_tarefa.id_coluna.clone()).unwrap();
    let resultado = editar_coluna_tarefa(&pool, &id_tarefa, &id_coluna).await;

    if let Ok(_) = resultado {
        HttpResponse::Ok().json("Ok")
    } else {
        resultado.unwrap_err().as_response()
    }
}

#[put("/tarefa/criar")]
pub async fn criar_tarefa(
    dados_tarefa: web::Json<CriarTarefaDTO>,
    pool: web::Data<sqlx::PgPool>,
    session: Session,
) -> impl Responder {
    let id_usuario = session.get::<String>("id_usuario");

    if id_usuario.is_err() || id_usuario.as_ref().unwrap().is_none() {
        return ListaErros::ErroUsuarioNaoLogado.as_response();
    }

    let id_usuario = Uuid::parse_str(id_usuario.unwrap().unwrap().as_str());
    if let Err(_) = id_usuario {
        return ListaErros::ErroAuteticacao.as_response();
    }
    let id_usuario = id_usuario.unwrap();

    let resultado_pk_coluna = consultar_pk_por_id_coluna(
        &pool,
        dados_tarefa
            .id_coluna
            .as_ref()
            .map(|id_coluna| id_coluna.as_str())
            .unwrap(),
    )
    .await;

    if let Ok(pk_coluna) = resultado_pk_coluna {
        let resultado = gravar_nova_tarefa(
            &pool,
            &dados_tarefa.titulo,
            dados_tarefa
                .descricao
                .as_ref()
                .map(|descricao| descricao.as_str()),
            pk_coluna,
            dados_tarefa.prioridade,
            vec![],
            id_usuario,
        )
        .await;

        if let Ok(id_tarefa) = resultado {
            return HttpResponse::Ok().json(id_tarefa.to_string());
        } else {
            return resultado.unwrap_err().as_response();
        }
    } else {
        resultado_pk_coluna.unwrap_err().as_response()
    }
}
