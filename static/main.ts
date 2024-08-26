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

type Tag = string;

(async function main() {
    // let mockResposta: Quadro = {
    //     "idQuadro": 1,
    //     "titulo": "Nome do quadro",
    //     "descricao": "Descrição do quadro",
    //     "colunas": [
    //         {
    //             "idEstado": 1,
    //             "nomeEstado": "Backlog",
    //             "ordemEstado": 1,
    //             "tarefas": [
    //                 {
    //                     "id": 1,
    //                     "idEstado": 1,
    //                     "titulo": "Título da tarefa",
    //                     "descricao": "Descrição da tarefa",
    //                     tags: ["Frontend", "Backend"]
    //                 },
    //                 {
    //                     "id": 2,
    //                     "idEstado": 1,
    //                     "titulo": "Título da tarefa",
    //                     "descricao": "Uma tarefa razoavelmente longa",
    //                     tags: ["Backend"]
    //                 }
    //             ]
    //         },
    //         {
    //             "idEstado": 2,
    //             "nomeEstado": "Em andamento",
    //             "ordemEstado": 2,
    //             "tarefas": [
    //                 {
    //                     "id": 3,
    //                     "idEstado": 3,
    //                     "titulo": "Título da tarefa",
    //                     "descricao": "Tarefa super longa que vai me tomar muito tempo",
    //                     tags: ["Backend", "Performance"]
    //                 }
    //             ]
    //         },
    //         {
    //             "idEstado": 3,
    //             "nomeEstado": "Concluída",
    //             "ordemEstado": 3,
    //             "tarefas": [
    //                 {
    //                     "id": 4,
    //                     "idEstado": 3,
    //                     "titulo": "Título da tarefa",
    //                     "descricao": "Descrição da tarefa",
    //                     tags: ["Backend"]
    //                 }
    //             ]
    //         },
    //     ]
    // }

    let resposta = (await fetch("http://localhost:8080/api/v1/quadro/1"));
    let corpoResposta = await resposta.json() as Quadro;
    criarQuadro(corpoResposta);
})()

function criarQuadro(quadro: Quadro) {
    let quadroDiv = document.getElementById("quadro-kanban") as HTMLDivElement;

    // Criação
    let tituloQuadro = document.createElement("h1");
    let descricaoQuadro = document.createElement("p");
    let colunaContainer = document.createElement("div");

    // Estilo
    colunaContainer.classList.add("coluna-container");

    // Dados
    tituloQuadro.innerText = quadro.titulo;
    descricaoQuadro.innerText = quadro.descricao;

    // Inserção
    quadroDiv.appendChild(tituloQuadro);
    quadroDiv.appendChild(descricaoQuadro);
    quadroDiv.appendChild(colunaContainer);
    for (let estado of quadro.colunas) {
        criarColuna(colunaContainer, estado);
    }
}

function criarColuna(root: HTMLElement, estado: Estado): HTMLDivElement {
    // Criação
    let colunaEstado = document.createElement("div");
    let colunaHeader = document.createElement("div");
    let tituloColuna = document.createElement("h2");
    let btnAdicionarTarefa = document.createElement("button");

    // Estilo
    colunaEstado.addEventListener("drop", drop)
    colunaEstado.addEventListener("dragover", dragover)
    colunaEstado.classList.add("coluna-kanban")
    tituloColuna.classList.add("titulo-coluna")
    colunaHeader.classList.add("header-coluna")

    // Dados
    tituloColuna.innerText = estado.nomeEstado;
    btnAdicionarTarefa.innerText = "+";
    colunaEstado.setAttribute("data-id-estado", estado.idEstado.toString());

    // Inserção
    root.appendChild(colunaEstado);

    colunaEstado.appendChild(colunaHeader);
    colunaHeader.appendChild(btnAdicionarTarefa);
    colunaHeader.appendChild(tituloColuna);

    for (let tarefa of estado.tarefas) {
        criarCardTarefa(colunaEstado, tarefa);
    }

    return colunaEstado;
}

function criarCardTarefa(root: HTMLElement, tarefa: Tarefa): HTMLDivElement {
    // Criação
    let tarefaDiv = document.createElement("div");
    let pTitulo = document.createElement("p");
    let pDescricao = document.createElement("p");
    let secaoTags = document.createElement("div");

    // Inserção
    root.appendChild(tarefaDiv);
    tarefaDiv.appendChild(pTitulo);
    tarefaDiv.appendChild(pDescricao);
    tarefaDiv.appendChild(secaoTags)


    // Estilos
    tarefaDiv.setAttribute("draggable", "true")
    tarefaDiv.addEventListener("dragstart", drag)
    tarefaDiv.classList.add("card");
    pTitulo.classList.add("titulo-card");
    pDescricao.classList.add("descricao-card");
    secaoTags.classList.add("tag-container");

    // Dados
    tarefaDiv.setAttribute("data-id-tarefa", tarefa.id.toString());
    pTitulo.innerText = tarefa.titulo;
    pDescricao.innerText = tarefa.descricao;
    for (let tag of tarefa.tags) {
        criarTag(secaoTags, tag);
    }

    return tarefaDiv;
}

function criarTag(root: HTMLElement, tag: Tag) {
    // Criação
    let tagElement = document.createElement("span");

    // Inserção
    root.appendChild(tagElement);

    // Estilo
    tagElement.classList.add("tag")

    // Dados
    tagElement.innerText = tag;

    return tagElement
}

function dragover(ev: Event) {
    ev.preventDefault();
}

function drag(ev: DragEvent) {
    let tarefaId = (ev.target as HTMLElement)?.getAttribute("data-id-tarefa");
    if (tarefaId)
        ev.dataTransfer?.setData("text", tarefaId);
}

function drop(ev: DragEvent) {
    try {
        ev.preventDefault();
    }
    catch (error) { }

    if (ev.dataTransfer) {
        let data = ev.dataTransfer.getData("text");
        let card = document.querySelector(`[data-id-tarefa="${data}"]`);

        if (card != null) {
            mudarColuna(ev.target as HTMLElement, card)
        }
    }
}

function mudarColuna(novaColuna: HTMLElement, tarefa: Element) {
    // Apenas insere a tarefa se o alvo for uma coluna
    while (!novaColuna.classList.contains("coluna-kanban")) {
        if (novaColuna.parentElement) {
            // Se não for uma coluna, tenta o elemento pai
            novaColuna = novaColuna.parentElement
        } else {
            // Se o alvo não está contido em uma coluna, não faz nada
            return;
        }
    }
    novaColuna.appendChild(tarefa)
}
