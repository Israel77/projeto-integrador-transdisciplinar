import { MensagemErro } from "../types/types";

export function renderizarErro(root: HTMLElement, mensagemErro: MensagemErro, tempoExibicao: number = 3000) {
    renderizarErroString(root, mensagemErro.message, tempoExibicao);
}

export function renderizarErroString(root: HTMLElement, mensagemErro: string, tempoExibicao: number = 3000) {
    const divContainer = document.createElement("div");
    const pDescricaoErro = document.createElement("p");

    divContainer.classList.add("container");
    divContainer.classList.add("bg-vermelho");
    divContainer.classList.add("mensagem-erro");

    pDescricaoErro.innerText = mensagemErro;

    divContainer.appendChild(pDescricaoErro);
    root.insertBefore(divContainer, root.firstChild);

    setTimeout(() => {
        root.removeChild(divContainer);
    }, tempoExibicao);
}