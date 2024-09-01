import { criarTag } from "./TagTarefa";

export function criarCardTarefa(root: HTMLElement, tarefa: Tarefa): HTMLDivElement {
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

function drag(ev: DragEvent) {
    let tarefaId = (ev.target as HTMLElement)?.getAttribute("data-id-tarefa");
    if (tarefaId)
        ev.dataTransfer?.setData("text", tarefaId);
}