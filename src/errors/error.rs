use actix_web::{http::StatusCode, HttpResponse};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct MensagemErro {
    code: String,
    message: String,
    #[serde(skip_serializing)]
    status_code: u16,
}

pub enum ListaErros {
    // Erro genérico
    ErroInterno,
    // Erros de autenticação e autorização
    ErroUsuarioNaoEncontrado(String),
    ErroUsuarioNaoAutorizado(String),
    ErroAuteticacao,
    ErroUsuarioNaoLogado,
    // Erros de criação de usuário
    ErroSenhaCurta,
    ErroUsuarioJaExistente(String),
    ErroEmailJaExistente(String),
    // Erros de query
    ErroSQL(sqlx::Error),
}

impl ListaErros {
    fn as_mensagem(&self) -> MensagemErro {
        match self {
            ListaErros::ErroInterno => MensagemErro {
                code: "001".to_string(),
                message: "Erro interno do servidor".to_string(),
                status_code: 500,
            },
            ListaErros::ErroUsuarioNaoEncontrado(nome_usuario) => MensagemErro {
                code: "101".to_string(),
                message: format!("Usuário {} não encontrado", nome_usuario),
                status_code: 404,
            },
            ListaErros::ErroUsuarioNaoAutorizado(nome_usuario) => MensagemErro {
                code: "102".to_string(),
                message: format!(
                    "Usuário {} não possui autorização para acessar este recurso",
                    nome_usuario
                ),
                status_code: 403,
            },
            ListaErros::ErroAuteticacao => MensagemErro {
                code: "103".to_string(),
                message: "Usuário ou senha inválidos".to_string(),
                status_code: 401,
            },
            ListaErros::ErroUsuarioNaoLogado => MensagemErro {
                code: "104".to_string(),
                message: "Usuário não está logado".to_string(),
                status_code: 401,
            },
            ListaErros::ErroSenhaCurta => MensagemErro {
                code: "201".to_string(),
                message: "Senha muito curta".to_string(),
                status_code: 400,
            },
            ListaErros::ErroUsuarioJaExistente(nome_usuario) => MensagemErro {
                code: "202".to_string(),
                message: format!("Usuário {} já existe", nome_usuario),
                status_code: 400,
            },
            ListaErros::ErroEmailJaExistente(email) => MensagemErro {
                code: "203".to_string(),
                message: format!("Email {} já está cadastrado", email),
                status_code: 400,
            },
            ListaErros::ErroSQL(erro) => MensagemErro {
                code: "901".to_string(),
                message: format!("Erro na consulta ao banco de dados: {}", erro.to_string())
                    .to_string(),
                status_code: 500,
            },
        }
    }

    pub fn as_response(&self) -> HttpResponse {
        let mensagem = self.as_mensagem();
        HttpResponse::build(StatusCode::from_u16(mensagem.status_code).unwrap()).json(mensagem)
    }
}

impl From<sqlx::Error> for ListaErros {
    fn from(error: sqlx::Error) -> Self {
        ListaErros::ErroSQL(error)
    }
}
