import { abrirDialogoApagarColuna } from "/pages/main/dialogos/ConfirmarApagarColuna.js";
import { abrirDialogoApagarTarefa } from "/pages/main/dialogos/ConfirmarApagarTarefa.js";
import { abrirCriadorColuna } from "/pages/main/dialogos/CriadorColuna.js";
import { abrirCriadorTarefa } from "/pages/main/dialogos/CriadorTarefa.js";
import { abrirEditorTarefa } from "/pages/main/dialogos/EditorTarefa.js";
import { QuadroView } from "/pages/main/quadro.js";

export function adicionarEventListeners(quadroView: QuadroView) {
    // Colunas
    adicionarEventListenerBotaoCriarColuna(quadroView);
    adicionarEventListenersBotaoDeletarColuna(quadroView);
    // Tarefas
    adicionarEventListenersEditarTarefas(quadroView);
    adicionarEventListenersBotaoCriarTarefa(quadroView);
    adicionarEventListenersBotaoDeletarTarefa(quadroView);
}

function adicionarEventListenerBotaoCriarColuna(quadroView: QuadroView) {
    const botaoCriarColuna = document.getElementById("criar-coluna");
    botaoCriarColuna?.addEventListener("click", (e) => abrirCriadorColuna(e, quadroView));
}

// Edição de tarefas
function adicionarEventListenersEditarTarefas(quadroView: QuadroView) {
    // Adicionar event listeners nas tarefas
    let tarefas = document.querySelectorAll(".card[data-id-tarefa]");
    for (const tarefa of tarefas) {
        tarefa.addEventListener("click", (e) => abrirEditorTarefa(e, quadroView));
    }
}

// Criação de tarefas
function adicionarEventListenersBotaoCriarTarefa(quadroView: QuadroView) {
    const botoesAdicionarTarefa = document.getElementsByClassName("btn-adicionar-tarefa");
    for (const botaoAdicionarTarefa of botoesAdicionarTarefa) {
        botaoAdicionarTarefa.addEventListener("click", e => abrirCriadorTarefa(e, quadroView));
    }
}

function adicionarEventListenersBotaoDeletarTarefa(quadroView: QuadroView) {
    const botoesDeletar = document.getElementsByClassName("btn-deletar");

    for (const botaoDeletar of botoesDeletar) {
        botaoDeletar.addEventListener("click", (e: MouseEvent) => {
            e.stopPropagation();

            let tarefaDiv: HTMLElement = e.target as HTMLElement;
            while (tarefaDiv.dataset.idTarefa === undefined || tarefaDiv.tagName !== "DIV") {
                if (tarefaDiv.parentElement === null) return;

                tarefaDiv = tarefaDiv.parentElement;
            }

            let colunaDiv = tarefaDiv.parentElement as HTMLElement;
            if (colunaDiv == null) return;

            while (colunaDiv.dataset.idColuna === undefined || colunaDiv.tagName !== "DIV") {
                if (colunaDiv.parentElement === null) return;

                colunaDiv = colunaDiv.parentElement;
            }

            let tituloTarefa: string | undefined;
            for (const child of tarefaDiv.children) {
                if (child.classList.contains("titulo-card")) {
                    tituloTarefa = child.innerHTML;
                    break;
                }
            }
            if (tituloTarefa === undefined) return;

            abrirDialogoApagarTarefa(quadroView, colunaDiv, tarefaDiv, tarefaDiv.dataset.idTarefa, tituloTarefa);
        });
    }
}

function adicionarEventListenersBotaoDeletarColuna(quadroView: QuadroView) {
    const botoesDeletarColuna = document.getElementsByClassName("btn-remover-coluna");

    for (const botao of botoesDeletarColuna) {
        botao.addEventListener("click", (ev: MouseEvent) => {// Apenas remove se o alvo for uma coluna
            let colunaDiv = ev.target as HTMLElement;
            let idColuna = colunaDiv.dataset.idColuna;
            while (idColuna == undefined) {
                if (colunaDiv.parentElement) {
                    // Se não for uma coluna, tenta o elemento pai
                    colunaDiv = colunaDiv.parentElement
                    idColuna = colunaDiv.dataset.idColuna;
                } else {
                    // Se o alvo não está contido em uma coluna, não faz nada
                    return;
                }
            }

            let colunaContainer = colunaDiv.parentElement;
            if (colunaContainer == null) {
                console.error("Coluna sem elemento pai.")
                return;
            }

            let nomeColuna: string | undefined;
            let header: Element | undefined = undefined;
            for (const child of colunaDiv.children) {
                if (child.classList.contains("header-coluna")) {
                    header = child;
                    break;
                }
            }
            if (header == undefined) return;

            for (const child of header?.children) {
                if (child.classList.contains("titulo-coluna")) {
                    if (child.tagName !== "INPUT") {
                        console.error("Tag input esperada para o título da coluna");
                        return;
                    }

                    nomeColuna = (child as HTMLInputElement).value || "";
                    break;
                }
            }

            if (nomeColuna === undefined) return;

            abrirDialogoApagarColuna(quadroView, idColuna, nomeColuna);
        });
    }
}