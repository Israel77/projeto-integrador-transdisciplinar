import { criarQuadro } from "../../components/QuadroKanban.js";
import { buscarDadosTarefa } from "../../services/buscarDadosTarefa.js";
import { fazerLogout } from "../../services/fazerLogout.js";
import { RespostaLogin, verificarLogin } from "../../services/verificarLogin.js";
import type { MensagemErro, Quadro } from "../../types/types";


(async () => {
    const dadosLogin = await verificarLogin();

    if (!dadosLogin.hasOwnProperty("id")) {
        window.location.href = "/";
        return;
    }

    // Por enquanto, cada usuário terá apenas um quadro
    const idQuadro = (dadosLogin as RespostaLogin).quadros[0];
    const resposta = await fetch(`/api/v1/quadro/${idQuadro}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (resposta.ok) {
        const corpoResposta = await resposta.json() as Quadro;
        criarQuadro(corpoResposta);
    } else {
        const corpoResposta = await resposta.json() as MensagemErro;
        console.error(corpoResposta.message);
    }

    const botaoLogout = document.getElementById("botao-logout") as HTMLButtonElement;
    botaoLogout.addEventListener("click", async () => {
        await fazerLogout();
        window.location.href = "/";
    });

    // Adicionar event listeners nas tarefas
    let tarefas = document.querySelectorAll("[data-id-tarefa]");
    for (const tarefa of tarefas) {
        tarefa.addEventListener("click", abrirEditorTarefa);
    }
})()

async function abrirEditorTarefa(e: MouseEvent) {
    const dialogo = document.getElementById("editar-tarefa") as HTMLDialogElement;
    const idTarefa = (e.target as HTMLElement).dataset.idTarefa;

    if (idTarefa === undefined) {
        console.error("Não foi possível obter o ID da tarefa");
        return;
    }

    const dadosTarefa = await buscarDadosTarefa(idTarefa);

    const formEditarTarefa = document.createElement("form");
    if (dadosTarefa) {
        const inputTitulo = document.createElement("input");
        const inputDescricao = document.createElement("input");
        const botaoSalvar = document.createElement("button");

        inputTitulo.type = "text";
        inputTitulo.name = "titulo";
        inputTitulo.value = dadosTarefa.titulo;

        inputDescricao.type = "text";
        inputDescricao.name = "descricao";
        inputDescricao.value = dadosTarefa.descricao;

        botaoSalvar.type = "submit";
        botaoSalvar.textContent = "Salvar";
        botaoSalvar.addEventListener("click", async (e) => {
            e.preventDefault();
            const resposta = await fetch(`api/v1/tarefa/atualizar`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    idTarefa: idTarefa,
                    titulo: inputTitulo.value,
                    descricao: inputDescricao.value,
                    // TODO: Adicionar tags
                    tags: dadosTarefa.tags,
                    // TODO: Mover entre colunas
                    idColuna: dadosTarefa.idColuna
                })
            });

            dialogo.close();
        });

        formEditarTarefa.append(inputTitulo, inputDescricao, botaoSalvar);
    }

    dialogo.appendChild(formEditarTarefa);
    dialogo.showModal();
}