export type Quadro = {
    "idQuadro": string,
    "titulo": string,
    "descricao": string,
    "colunas": Coluna[]
}

export type Coluna = {
    "idColuna": string,
    "nomeColuna": string,
    "ordemColuna": number,
    "tarefas": Tarefa[]
}

export type Tarefa = {
    "id": string,
    "idColuna": string,
    "titulo": string,
    "descricao": string,
    "tags": Tag[]
}

export type RequisicaoLogin = {
    "nomeUsuario": string,
    "senha": string
}

export type MensagemErro = {
    "code": string,
    "message": string
}
export type Tag = string;

export type AppConfig = {
    "baseApiUrl": string,
}