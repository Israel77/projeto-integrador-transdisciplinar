import { deletarTarefa } from "../../services/deletarTarefa.js";
import { abrirDialogoApagarTarefa } from "./dialogos/ConfirmarApagarTarefa.js";
import { abrirCriadorColuna } from "./dialogos/CriadorColuna.js";
import { abrirCriadorTarefa } from "./dialogos/CriadorTarefa.js";
import { abrirEditorTarefa } from "./dialogos/EditorTarefa.js";
import { QuadroView } from "./quadro.js";

export function adicionarEventListeners(quadroView: QuadroView) {
    // Colunas
    adicionarEventListenerBotaoCriarColuna(quadroView);
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
            console.log(tarefaDiv.children);
            for (const child of tarefaDiv.children) {
                if (child.classList.contains("titulo-card")) {
                    tituloTarefa = child.innerHTML;
                    break;
                }
            }
            if (tituloTarefa === undefined) {
                console.error("Tarefa sem título?")
                return;
            }

            abrirDialogoApagarTarefa(quadroView, colunaDiv, tarefaDiv, tarefaDiv.dataset.idTarefa, tituloTarefa);
        });
    }
}