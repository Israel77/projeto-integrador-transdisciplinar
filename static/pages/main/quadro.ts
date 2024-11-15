import type { MensagemErro, Quadro } from "/types/types";

import { preencherQuadro } from "/components/QuadroKanban.js";
import { appConfig } from "/config.js";
import { adicionarEventListeners } from "/pages/main/eventListeners.js";
import * as fazerLogoutService from "/services/fazerLogout.js";
import * as verificarLoginService from "/services/verificarLogin.js";

export type QuadroView = {
    quadroDiv?: HTMLDivElement;
    quadro?: Quadro;
    idQuadro?: string;
};

export function inicializarQuadro(dadosLogin: verificarLoginService.RespostaLogin, quadroView: QuadroView) {
    preencherHeader(dadosLogin);

    if (!dadosLogin.hasOwnProperty("id")) {
        window.location.href = "/";
        return;
    }

    // Por enquanto, cada usuário terá apenas um quadro
    quadroView.idQuadro = (dadosLogin as verificarLoginService.RespostaLogin).quadros[0];

    carregarDadosQuadro(quadroView);
}

export function carregarDadosQuadro(quadroView: QuadroView) {
    fetch(`${appConfig.baseApiUrl}/api/v1/quadro/${quadroView.idQuadro}`, {
        method: "GET",
        credentials: "include",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(resposta => {
        if (resposta.ok) {
            resposta.json().then((quadro: Quadro) => {
                console.log(quadro);
                quadroView.quadro = quadro;
                quadroView.quadroDiv = document.getElementById("quadro-kanban") as HTMLDivElement;
                preencherQuadro(quadroView.quadroDiv, quadro);
                document.body.appendChild(quadroView.quadroDiv);
            }).then(() => {
                adicionarEventListeners(quadroView);
            });
        } else {
            resposta.json().then((err: MensagemErro) => {
                console.error(err.message);
            });
        }
    });
}

// Recarrega o quadro a partir do servidor
export function recarregarQuadro(quadroView: QuadroView) {
    console.log("Recarregando quadro");

    apagarDadosQuadro(quadroView);
    carregarDadosQuadro(quadroView);
}

// Atualiza a visualização do quadro a partir dos dados locais
export function atualizarView(quadroView: QuadroView) {
    apagarDadosQuadro(quadroView);

    const quadro = quadroView.quadro as Quadro;
    quadroView.quadroDiv = document.getElementById("quadro-kanban") as HTMLDivElement;
    preencherQuadro(quadroView.quadroDiv, quadro);
    adicionarEventListeners(quadroView);
}

export function preencherHeader(dadosLogin: verificarLoginService.RespostaLogin) {
    const headerDiv = document.getElementById("quadro-header") as HTMLDivElement;

    // Cumprimento
    const pCumprimento = document.createElement("p");
    const hora = new Date();
    let cumprimento: string;

    if (0 <= hora.getHours() && hora.getHours() < 12) {
        cumprimento = "Bom dia, " + dadosLogin.nomeUsuario;
    } else if (12 <= hora.getHours() && hora.getHours() < 18) {
        cumprimento = "Boa tarde, " + dadosLogin.nomeUsuario;
    } else {
        cumprimento = "Boa noite, " + dadosLogin.nomeUsuario;
    }
    pCumprimento.innerText = cumprimento;

    // Botão de sair
    const botaoSair = document.createElement('button');

    botaoSair.id = 'botao-logout';
    botaoSair.className = 'bg-vermelho';
    botaoSair.textContent = 'Sair';

    botaoSair.addEventListener("click", async () => {
        await fazerLogoutService.fazerLogout();
        window.location.href = "/";
    });

    headerDiv.append(pCumprimento, botaoSair);
}

function apagarDadosQuadro(quadroView: QuadroView) {
    if (quadroView.quadroDiv === undefined) return;

    // Remove todos os elementos filhos do quadro, exceto o header
    while (quadroView.quadroDiv.children.length > 1) {
        const lastChild = quadroView.quadroDiv.lastChild as HTMLElement;
        if (lastChild && lastChild.id !== "quadro-header") {
            quadroView.quadroDiv.removeChild(lastChild);
        }
    }
}