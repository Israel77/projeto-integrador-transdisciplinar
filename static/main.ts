type Quadro = {
    "idQuadro": number,
    "titulo": string,
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
    "tags": string[]
}

(() => {
    let quadroDiv = document.getElementById("quadro-kanban") as HTMLDivElement;

    let resp: Quadro = {
        "idQuadro": 1,
        "titulo": "Nome do quadro",
        "colunas": [
            {
                "idEstado": 20,
                "nomeEstado": "Backlog",
                "ordemEstado": 1,
                "tarefas": [
                    {
                        "id": 1,
                        "idEstado": 20,
                        "titulo": "Título da tarefa",
                        "descricao": "Descrição da tarefa",
                        tags: []
                    }
                ]
            }
        ]
    }

    for (let estado of resp.colunas) {
        criarColuna(quadroDiv, estado);
    }


})()

function criarColuna(quadroDiv: HTMLDivElement, estado: Estado): HTMLDivElement {
    // Criação
    let estadoColuna = document.createElement("div");

    // Inserção
    quadroDiv.appendChild(estadoColuna);
    for (let tarefa of estado.tarefas) {
        let cardTarefa = criarCardTarefa(estadoColuna, tarefa);
    }

    // Estilo
    estadoColuna.classList.add("coluna-kanban")

    // Dados
    return estadoColuna;
}

function criarCardTarefa(colunaEstado: HTMLDivElement, tarefa: Tarefa): HTMLDivElement {
    // Criação
    let tarefaDiv = document.createElement("div");
    let pTitulo = document.createElement("p");
    let pDescricao = document.createElement("p");

    // Inserção
    tarefaDiv.appendChild(pTitulo);
    tarefaDiv.appendChild(pDescricao);
    colunaEstado.appendChild(tarefaDiv)

    // Estilos
    tarefaDiv.classList.add("card");
    pTitulo.classList.add("titulo-card");
    pDescricao.classList.add("descricao-card");

    // Dados
    pTitulo.innerText = tarefa.titulo;
    pDescricao.innerText = tarefa.descricao;

    return tarefaDiv;
}


