type Quadro = {
    "idQuadro": number,
    "titulo": string,
    "descricao": string,
    "colunas": Estado[]
}

type Estado = {
    "idEstado": number,
    "nomeEstado": string,
    "ordemEstado": number,
    "tarefas": Tarefa[]
}

type Tarefa = {
    "id": number,
    "idEstado": number,
    "titulo": string,
    "descricao": string,
    "tags": Tag[]
}

type RequisicaoLogin = {
    "nome_usuario": string,
    "senha": string
}

type Tag = string;