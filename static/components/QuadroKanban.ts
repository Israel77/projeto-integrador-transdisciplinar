import type { Quadro } from "../types/types";
import { criarColuna } from "./ColunaKanban.js";

export function preencherQuadro(quadroDiv: HTMLElement, quadro: Quadro) {

    // Criação
    const tituloQuadro = document.createElement("h1");
    const descricaoQuadro = document.createElement("p");
    const colunaContainer = document.createElement("div");
    const botaoCriarColuna = document.createElement("button");

    // Estilo
    colunaContainer.classList.add("coluna-container");
    botaoCriarColuna.id = "criar-coluna";

    // Dados
    tituloQuadro.innerText = quadro.titulo;
    descricaoQuadro.innerText = quadro.descricao;
    botaoCriarColuna.innerText = "Criar nova coluna";

    // Inserção
    quadroDiv.appendChild(tituloQuadro);
    quadroDiv.appendChild(descricaoQuadro);
    quadroDiv.appendChild(botaoCriarColuna);
    quadroDiv.appendChild(colunaContainer);
    for (let coluna of quadro.colunas) {
        criarColuna(colunaContainer, coluna);
    }

    return quadroDiv;
}