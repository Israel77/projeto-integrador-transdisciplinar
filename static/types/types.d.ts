export type Quadro = {
    "idQuadro": number,
    "titulo": string,
    "descricao": string,
    "colunas": Estado[]
}

export type Estado = {
    "idEstado": number,
    "nomeEstado": string,
    "ordemEstado": number,
    "tarefas": Tarefa[]
}

export type Tarefa = {
    "id": number,
    "idEstado": number,
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