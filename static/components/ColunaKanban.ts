import type { Coluna as Coluna } from "../types/types";
import { criarCardTarefa } from "./CardTarefa.js";

export function criarColuna(root: HTMLElement, coluna: Coluna): HTMLDivElement {
    // Criação
    let colunaDiv = document.createElement("div");
    let colunaHeader = document.createElement("div");
    let tituloColuna = document.createElement("h2");
    let btnAdicionarColuna = document.createElement("button");
    let btnAdicionarTarefa = document.createElement("button");

    // Estilo
    colunaDiv.addEventListener("drop", drop)
    colunaDiv.addEventListener("dragover", dragover)
    colunaDiv.classList.add("coluna-kanban")
    tituloColuna.classList.add("titulo-coluna")
    colunaHeader.classList.add("header-coluna")

    // Dados
    tituloColuna.innerText = coluna.nomeColuna;
    btnAdicionarColuna.innerText = "+";
    btnAdicionarTarefa.innerText = "Criar nova tarefa";
    colunaDiv.setAttribute("data-id-coluna", coluna.idColuna.toString());

    // Inserção
    root.appendChild(colunaDiv);

    colunaDiv.appendChild(colunaHeader);
    colunaHeader.appendChild(tituloColuna);
    colunaHeader.appendChild(btnAdicionarColuna);

    for (let tarefa of coluna.tarefas) {
        criarCardTarefa(colunaDiv, tarefa);
    }

    colunaDiv.appendChild(btnAdicionarTarefa);

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

    // Insere a tarefa na nova coluna antes do botão
    const botao = novaColuna.removeChild(novaColuna.lastChild as HTMLButtonElement);
    novaColuna.appendChild(tarefa)
    novaColuna.appendChild(botao)

    fetch("/api/v1/tarefa/atualizar/coluna", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            idTarefa: tarefa.getAttribute("data-id-tarefa"),
            idColuna: novaColuna.getAttribute("data-id-coluna")
        })
    })
}