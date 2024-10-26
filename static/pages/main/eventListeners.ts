import { abrirCriadorColuna } from "./dialogos/CriadorColuna.js";
import { abrirCriadorTarefa } from "./dialogos/CriadorTarefa.js";
import { abrirEditorTarefa } from "./dialogos/EditorTarefa.js";
import { QuadroView } from "./quadro.js";

export function adicionarEventListeners(quadroView: QuadroView) {
    adicionarEventListenerBotaoCriarColuna(quadroView);
    adicionarEventListenersTarefas(quadroView);
    adicionarEventListenersBotaoCriarTarefa(quadroView);
}

function adicionarEventListenerBotaoCriarColuna(quadroView: QuadroView) {
    const botaoCriarColuna = document.getElementById("criar-coluna");
    botaoCriarColuna?.addEventListener("click", (e) => abrirCriadorColuna(e, quadroView));
}

// Edição de tarefas
function adicionarEventListenersTarefas(quadroView: QuadroView) {
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