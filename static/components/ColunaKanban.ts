import { criarCardTarefa } from "./CardTarefa";

export function criarColuna(root: HTMLElement, estado: Estado): HTMLDivElement {
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

function dragover(ev: Event) {
    ev.preventDefault();
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