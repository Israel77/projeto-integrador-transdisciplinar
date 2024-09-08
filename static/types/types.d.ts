export type Quadro = {
    "idQuadro": string,
    "titulo": string,
    "descricao": string,
    "colunas": Estado[]
}

export type Estado = {
    "idColuna": string,
    "nomeEstado": string,
    "ordemEstado": number,
    "tarefas": Tarefa[]
}

export type Tarefa = {
    "id": string,
    "idEstado": string,
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