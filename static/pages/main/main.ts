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

(async () => {
    const dadosLogin = await verificarLogin();

    inicializarQuadro(dadosLogin as RespostaLogin);
})()

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
                adicionarEventListenersBotaoCriarTarefa();
            });
        } else {
            resposta.json().then((err: MensagemErro) => {
                console.error(err.message);
            });
        }
    });

}

// Edição de tarefas
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

        // Label da descrição
        labelDescricao.textContent = "Descrição";
        labelTitulo.htmlFor = "editar-descricao";

        // Input da descrição
        inputDescricao.id = "editar-descricao";
        inputDescricao.name = "descricao";

        if (dadosTarefa) {
            inputTitulo.value = dadosTarefa.titulo;
            inputDescricao.value = dadosTarefa.descricao;
        }

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

        dialogo.appendChild(formEditarTarefa);
        dialogo.showModal();
    } catch (error) {
        console.error("Erro ao buscar dados da tarefa:", error);
    }
}

// Criação de tarefas
function adicionarEventListenersBotaoCriarTarefa() {
    const botoesAdicionarTarefa = document.getElementsByClassName("btn-adicionar-tarefa");
    for (const botaoAdicionarTarefa of botoesAdicionarTarefa) {
        botaoAdicionarTarefa.addEventListener("click", abrirCriadorTarefa);
    }
}

function abrirCriadorTarefa(e: MouseEvent) {
    const dialogo = document.getElementById("modal") as HTMLDialogElement;

    const formCriarTarefa = document.createElement("form");
    formCriarTarefa.classList.add("vertical-form");

    dialogo.appendChild(formCriarTarefa);

    formCriarTarefa.classList.add("vertical-form");
    const labelTitulo = document.createElement("label");
    const inputTitulo = document.createElement("input");
    const labelDescricao = document.createElement("label");
    const inputDescricao = document.createElement("textarea");
    const labelColuna = document.createElement("label");
    const seletorColuna = document.createElement("select");
    const botaoSalvar = document.createElement("button");

    // Label do título
    labelTitulo.textContent = "Título";
    labelTitulo.htmlFor = "editar-titulo";

    // Input do título
    inputTitulo.id = "editar-titulo";
    inputTitulo.type = "text";
    inputTitulo.name = "titulo";

    // Label da descrição
    labelDescricao.textContent = "Descrição";
    labelTitulo.htmlFor = "editar-descricao";

    // Input da descrição
    inputDescricao.id = "editar-descricao";
    inputDescricao.name = "descricao";

    // Label do seletor de coluna
    labelColuna.textContent = "Coluna";
    labelColuna.htmlFor = "seletor-coluna";

    // Seletor da coluna
    seletorColuna.id = "seletor-coluna";
    seletorColuna.name = "coluna";
    for (const coluna of quadroView.quadro?.colunas || []) {
        const opcao = document.createElement("option");
        opcao.value = coluna.idColuna;
        opcao.textContent = coluna.nomeColuna;
        seletorColuna.appendChild(opcao);
    }

    // Botão de salvar
    botaoSalvar.type = "submit";
    botaoSalvar.textContent = "Salvar";
    const criarTarefa = async (e: MouseEvent) => {
        e.preventDefault();
        try {
            await fetch(`api/v1/tarefa/criar`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    titulo: inputTitulo.value,
                    descricao: inputDescricao.value,
                    idColuna: seletorColuna.value
                })
            });
        } catch (error) {
            console.error("Erro ao atualizar tarefa:", error);
        } finally {
            dialogo.removeChild(formCriarTarefa);
            dialogo.close();
            recarregarQuadro(quadroView);
        }
    }
    botaoSalvar.addEventListener("click", criarTarefa);

    // Botão de cancelar
    const botaoCancelar = document.createElement("button");
    botaoCancelar.textContent = "Cancelar";
    botaoCancelar.classList.add("bg-vermelho");
    botaoCancelar.addEventListener("click", () => {
        dialogo.removeChild(formCriarTarefa);
        dialogo.close();
    });


    // Container dos botões
    const botaoContainer = document.createElement("div");
    botaoContainer.classList.add("botoes-container");
    botaoContainer.append(botaoCancelar, botaoSalvar);

    formCriarTarefa.append(
        labelColuna,
        seletorColuna,
        labelTitulo,
        inputTitulo,
        labelDescricao,
        inputDescricao,
        botaoContainer
    );

    dialogo.showModal();
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