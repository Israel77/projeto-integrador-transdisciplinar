(function () {
    var quadroDiv = document.getElementById("quadro-kanban");
    var resp = {
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
    };
    for (var _i = 0, _a = resp.colunas; _i < _a.length; _i++) {
        var estado = _a[_i];
        criarColuna(quadroDiv, estado);
    }
})();
function criarColuna(quadroDiv, estado) {
    // Criação
    var estadoColuna = document.createElement("div");
    // Inserção
    quadroDiv.appendChild(estadoColuna);
    // Estilo
    estadoColuna.classList.add("coluna-kanban");
    // Dados
    for (var _i = 0, _a = estado.tarefas; _i < _a.length; _i++) {
        var tarefa = _a[_i];
        var cardTarefa = criarCardTarefa(estadoColuna, tarefa);
    }
    return estadoColuna;
}
function criarCardTarefa(colunaEstado, tarefa) {
    // Criação
    var tarefaDiv = document.createElement("div");
    var pTitulo = document.createElement("p");
    var pDescricao = document.createElement("p");
    // Inserção
    tarefaDiv.appendChild(pTitulo);
    tarefaDiv.appendChild(pDescricao);
    colunaEstado.appendChild(tarefaDiv);
    // Estilos
    tarefaDiv.classList.add("card");
    pTitulo.classList.add("titulo-card");
    pDescricao.classList.add("descricao-card");
    // Dados
    pTitulo.innerText = tarefa.titulo;
    pDescricao.innerText = tarefa.descricao;
    return tarefaDiv;
}
