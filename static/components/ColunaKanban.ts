import type { Coluna as Coluna } from "../types/types";
import { criarCardTarefa } from "./CardTarefa.js";

export function criarColuna(root: HTMLElement, coluna: Coluna): HTMLDivElement {
    // Criação
    let colunaDiv = document.createElement("div");
    let colunaHeader = document.createElement("div");
    let tituloColuna = document.createElement("h2");
    let btnAdicionarTarefa = document.createElement("button");

    // Estilo
    colunaDiv.addEventListener("drop", drop)
    colunaDiv.addEventListener("dragover", dragover)
    colunaDiv.classList.add("coluna-kanban")
    tituloColuna.classList.add("titulo-coluna")
    colunaHeader.classList.add("header-coluna")

    // Dados
    tituloColuna.innerText = coluna.nomeColuna;
    btnAdicionarTarefa.innerText = "+";
    colunaDiv.setAttribute("data-id-coluna", coluna.idColuna.toString());

    // Inserção
    root.appendChild(colunaDiv);

    colunaDiv.appendChild(colunaHeader);
    colunaHeader.appendChild(btnAdicionarTarefa);
    colunaHeader.appendChild(tituloColuna);

    for (let tarefa of coluna.tarefas) {
        criarCardTarefa(colunaDiv, tarefa);
    }

    return colunaDiv;
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