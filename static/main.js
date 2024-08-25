(function () {
    var resp = {
        "idQuadro": 1,
        "titulo": "Nome do quadro",
        "descricao": "Descrição do quadro",
        "colunas": [
            {
                "idEstado": 1,
                "nomeEstado": "Backlog",
                "ordemEstado": 1,
                "tarefas": [
                    {
                        "id": 1,
                        "idEstado": 1,
                        "titulo": "Título da tarefa",
                        "descricao": "Descrição da tarefa",
                        tags: ["Frontend", "Backend"]
                    },
                    {
                        "id": 2,
                        "idEstado": 1,
                        "titulo": "Título da tarefa",
                        "descricao": "Uma tarefa razoavelmente longa",
                        tags: ["Backend"]
                    }
                ]
            },
            {
                "idEstado": 2,
                "nomeEstado": "Em andamento",
                "ordemEstado": 2,
                "tarefas": [
                    {
                        "id": 3,
                        "idEstado": 3,
                        "titulo": "Título da tarefa",
                        "descricao": "Tarefa super longa que vai me tomar muito tempo",
                        tags: ["Backend", "Performance"]
                    }
                ]
            },
            {
                "idEstado": 3,
                "nomeEstado": "Concluída",
                "ordemEstado": 3,
                "tarefas": [
                    {
                        "id": 4,
                        "idEstado": 3,
                        "titulo": "Título da tarefa",
                        "descricao": "Descrição da tarefa",
                        tags: ["Backend"]
                    }
                ]
            },
        ]
    };
    criarQuadro(resp);
})();
function criarQuadro(resp) {
    var quadroDiv = document.getElementById("quadro-kanban");
    // Criação
    var tituloQuadro = document.createElement("h1");
    var descricaoQuadro = document.createElement("p");
    var colunaContainer = document.createElement("div");
    // Estilo
    colunaContainer.classList.add("coluna-container");
    // Dados
    tituloQuadro.innerText = resp.titulo;
    descricaoQuadro.innerText = resp.descricao;
    // Inserção
    quadroDiv.appendChild(tituloQuadro);
    quadroDiv.appendChild(descricaoQuadro);
    quadroDiv.appendChild(colunaContainer);
    for (var _i = 0, _a = resp.colunas; _i < _a.length; _i++) {
        var estado = _a[_i];
        criarColuna(colunaContainer, estado);
    }
}
function criarColuna(root, estado) {
    // Criação
    var colunaEstado = document.createElement("div");
    var colunaHeader = document.createElement("div");
    var tituloColuna = document.createElement("h2");
    var btnAdicionarTarefa = document.createElement("button");
    // Estilo
    colunaEstado.addEventListener("drop", drop);
    colunaEstado.addEventListener("dragover", dragover);
    colunaEstado.classList.add("coluna-kanban");
    tituloColuna.classList.add("titulo-coluna");
    colunaHeader.classList.add("header-coluna");
    // Dados
    tituloColuna.innerText = estado.nomeEstado;
    btnAdicionarTarefa.innerText = "+";
    colunaEstado.setAttribute("data-id-estado", estado.idEstado.toString());
    // Inserção
    root.appendChild(colunaEstado);
    colunaEstado.appendChild(colunaHeader);
    colunaHeader.appendChild(btnAdicionarTarefa);
    colunaHeader.appendChild(tituloColuna);
    for (var _i = 0, _a = estado.tarefas; _i < _a.length; _i++) {
        var tarefa = _a[_i];
        criarCardTarefa(colunaEstado, tarefa);
    }
    return colunaEstado;
}
function criarCardTarefa(root, tarefa) {
    // Criação
    var tarefaDiv = document.createElement("div");
    var pTitulo = document.createElement("p");
    var pDescricao = document.createElement("p");
    var secaoTags = document.createElement("div");
    // Inserção
    root.appendChild(tarefaDiv);
    tarefaDiv.appendChild(pTitulo);
    tarefaDiv.appendChild(pDescricao);
    tarefaDiv.appendChild(secaoTags);
    // Estilos
    tarefaDiv.setAttribute("draggable", "true");
    tarefaDiv.addEventListener("dragstart", drag);
    tarefaDiv.classList.add("card");
    pTitulo.classList.add("titulo-card");
    pDescricao.classList.add("descricao-card");
    secaoTags.classList.add("tag-container");
    // Dados
    tarefaDiv.setAttribute("data-id-tarefa", tarefa.id.toString());
    pTitulo.innerText = tarefa.titulo;
    pDescricao.innerText = tarefa.descricao;
    for (var _i = 0, _a = tarefa.tags; _i < _a.length; _i++) {
        var tag = _a[_i];
        criarTag(secaoTags, tag);
    }
    return tarefaDiv;
}
function criarTag(root, tag) {
    // Criação
    var tagElement = document.createElement("span");
    // Inserção
    root.appendChild(tagElement);
    // Estilo
    tagElement.classList.add("tag");
    // Dados
    tagElement.innerText = tag;
    return tagElement;
}
function dragover(ev) {
    ev.preventDefault();
}
function drag(ev) {
    var _a, _b;
    var tarefaId = (_a = ev.target) === null || _a === void 0 ? void 0 : _a.getAttribute("data-id-tarefa");
    if (tarefaId)
        (_b = ev.dataTransfer) === null || _b === void 0 ? void 0 : _b.setData("text", tarefaId);
}
function drop(ev) {
    try {
        ev.preventDefault();
    }
    catch (error) { }
    if (ev.dataTransfer) {
        var data = ev.dataTransfer.getData("text");
        var card = document.querySelector("[data-id-tarefa=\"".concat(data, "\"]"));
        if (card != null) {
            mudarColuna(ev.target, card);
        }
    }
}
function mudarColuna(novaColuna, tarefa) {
    // Apenas insere a tarefa se o alvo for uma coluna
    while (!novaColuna.classList.contains("coluna-kanban")) {
        if (novaColuna.parentElement) {
            // Se não for uma coluna, tenta o elemento pai
            novaColuna = novaColuna.parentElement;
        }
        else {
            // Se o alvo não está contido em uma coluna, não faz nada
            return;
        }
    }
    novaColuna.appendChild(tarefa);
}
