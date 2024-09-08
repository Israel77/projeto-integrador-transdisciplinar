import type { Quadro } from "../types/types";
import { criarColuna } from "./ColunaKanban.js";

export function criarQuadro(quadro: Quadro) {
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