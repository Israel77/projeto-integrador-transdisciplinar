import { deletarTarefa } from "../services/deletarTarefa.js";
import type { Tarefa } from "../types/types";
import { criarTag } from "./TagTarefa.js";

export function criarCardTarefa(root: HTMLElement, tarefa: Tarefa): HTMLDivElement {
    // Criação
    let tarefaDiv = document.createElement("div");
    let pTitulo = document.createElement("p");
    let prioridadeSpan = document.createElement("span");
    let pDescricao = document.createElement("p");
    let secaoTags = document.createElement("div");
    let botaoDeletar = document.createElement("button");

    // Inserção
    root.appendChild(tarefaDiv);

    tarefaDiv.appendChild(pTitulo);
    tarefaDiv.appendChild(pDescricao);
    tarefaDiv.appendChild(secaoTags);
    tarefaDiv.appendChild(botaoDeletar);

    // Eventos
    tarefaDiv.addEventListener("dragstart", drag)

    // Estilos
    tarefaDiv.setAttribute("draggable", "true")

    botaoDeletar.classList.add("btn-deletar", "bg-vermelho");
    tarefaDiv.classList.add("card");
    pTitulo.classList.add("titulo-card");
    pDescricao.classList.add("descricao-card");
    secaoTags.classList.add("tag-container");
    prioridadeSpan.classList.add("card-prioridade");

    // Dados
    tarefaDiv.setAttribute("data-id-tarefa", tarefa.id);
    tarefaDiv.setAttribute("data-prioridade-tarefa", tarefa.prioridade.toString());

    botaoDeletar.innerText = "Apagar tarefa";
    pTitulo.innerText = tarefa.titulo;
    pDescricao.innerText = tarefa.descricao;
    for (let tag of tarefa.tags) {
        criarTag(secaoTags, tag);
    }
    prioridadeSpan.innerText = tarefa.prioridade.toString();
    pTitulo.appendChild(prioridadeSpan);

    return tarefaDiv;
}

function drag(ev: DragEvent) {
    let tarefaId = (ev.target as HTMLElement)?.getAttribute("data-id-tarefa");
    if (tarefaId)
        ev.dataTransfer?.setData("text", tarefaId);
}