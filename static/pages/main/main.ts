import { preencherQuadro } from "../../components/QuadroKanban.js";
import { buscarDadosTarefa } from "../../services/buscarDadosTarefa.js";
import { fazerLogout } from "../../services/fazerLogout.js";
import { RespostaLogin, verificarLogin } from "../../services/verificarLogin.js";
import type { MensagemErro, Quadro, Tarefa } from "../../types/types";

type QuadroView = {
    quadroDiv?: HTMLDivElement;
    quadro?: Quadro;
    idQuadro?: string;
};

let quadroView: QuadroView = {};

function inicializarQuadro(dadosLogin: RespostaLogin) {
    if (!dadosLogin.hasOwnProperty("id")) {
        window.location.href = "/";
        return;
    }

    const botaoLogout = document.getElementById("botao-logout") as HTMLButtonElement;
    botaoLogout.addEventListener("click", async () => {
        await fazerLogout();
        window.location.href = "/";
    });

    // Por enquanto, cada usuário terá apenas um quadro
    quadroView.idQuadro = (dadosLogin as RespostaLogin).quadros[0];

    carregarDadosQuadro();
}


function carregarDadosQuadro() {
    fetch(`/api/v1/quadro/${quadroView.idQuadro}`, {
        method: "GET",
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
                adicionarEventListenersTarefas();
            });
        } else {
            resposta.json().then((err: MensagemErro) => {
                console.error(err.message);
            });
        }
    });

}

function adicionarEventListenersTarefas() {
    // Adicionar event listeners nas tarefas
    let tarefas = document.querySelectorAll("[data-id-tarefa]");
    for (const tarefa of tarefas) {
        tarefa.addEventListener("click", abrirEditorTarefa);
    }
}

async function abrirEditorTarefa(e: MouseEvent) {
    const dialogo = document.getElementById("modal") as HTMLDialogElement;

    let proximoAlvo = e.target as HTMLElement;
    let idTarefa = proximoAlvo.dataset.idTarefa;

    while (idTarefa === undefined && proximoAlvo.parentElement !== null) {
        proximoAlvo = proximoAlvo.parentElement;
        idTarefa = proximoAlvo.dataset.idTarefa;
    }
    if (idTarefa === undefined) {
        console.error("Não foi possível obter o ID da tarefa");
        return;
    }

    try {
        const dadosTarefa = await buscarDadosTarefa(idTarefa) as Tarefa;
        const formEditarTarefa = document.createElement("form");
        formEditarTarefa.classList.add("vertical-form");
        if (dadosTarefa) {
            const labelTitulo = document.createElement("label");
            const inputTitulo = document.createElement("input");
            const labelDescricao = document.createElement("label");
            const inputDescricao = document.createElement("textarea");
            const botaoSalvar = document.createElement("button");

            // Label do título
            labelTitulo.textContent = "Título";
            labelTitulo.htmlFor = "editar-titulo";

            // Input do título
            inputTitulo.id = "editar-titulo";
            inputTitulo.type = "text";
            inputTitulo.name = "titulo";
            inputTitulo.value = dadosTarefa.titulo;

            // Label da descrição
            labelDescricao.textContent = "Descrição";
            labelTitulo.htmlFor = "editar-descricao";

            // Input da descrição
            inputDescricao.id = "editar-descricao";
            inputDescricao.name = "descricao";
            inputDescricao.value = dadosTarefa.descricao;

            // Botão de salvar
            botaoSalvar.type = "submit";
            botaoSalvar.textContent = "Salvar";
            const editarTarefa = async (e: MouseEvent) => {
                e.preventDefault();
                console.log(quadroView);
                try {
                    await fetch(`api/v1/tarefa/atualizar`, {
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
                } catch (error) {
                    console.error("Erro ao atualizar tarefa:", error);
                } finally {
                    dialogo.removeChild(formEditarTarefa);
                    dialogo.close();
                    recarregarQuadro(quadroView);
                }
            }
            botaoSalvar.addEventListener("click", editarTarefa);

            // Botão de cancelar
            const botaoCancelar = document.createElement("button");
            botaoCancelar.textContent = "Cancelar";
            botaoCancelar.classList.add("bg-vermelho");
            botaoCancelar.addEventListener("click", () => {
                dialogo.removeChild(formEditarTarefa);
                dialogo.close();
            });


            // Container dos botões
            const botaoContainer = document.createElement("div");
            botaoContainer.classList.add("botoes-container");
            botaoContainer.append(botaoCancelar, botaoSalvar);

            formEditarTarefa.append(labelTitulo, inputTitulo, labelDescricao, inputDescricao, botaoContainer);
        }

        dialogo.appendChild(formEditarTarefa);
        dialogo.showModal();
    } catch (error) {
        console.error("Erro ao buscar dados da tarefa:", error);
    }
}

function recarregarQuadro(quadroView: QuadroView) {
    console.log("Recarregando quadro");
    if (quadroView.quadroDiv !== undefined) {
        while (quadroView.quadroDiv.firstChild) {
            quadroView.quadroDiv.removeChild(quadroView.quadroDiv.firstChild);
        }
    }
    carregarDadosQuadro();
}


(async () => {
    const dadosLogin = await verificarLogin();

    inicializarQuadro(dadosLogin as RespostaLogin);
})()

