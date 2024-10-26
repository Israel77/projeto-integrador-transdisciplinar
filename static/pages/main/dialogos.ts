import type { MensagemErro, Quadro, Tag, Tarefa } from "../../types/types";

import { criarNovaColuna } from "../../services/criarNovaColuna.js";
import { QuadroView, recarregarQuadro } from "./quadro.js";
import * as buscarDadosTarefaService from "../../services/buscarDadosTarefa.js";
import * as criarTarefaService from "../../services/criarTarefa.js";
import * as editarTarefaService from "../../services/editarTarefa.js";

export function abrirCriadorColuna(e: MouseEvent, quadroView: QuadroView) {
    const dialogo = document.getElementById("modal") as HTMLDialogElement;

    const formCriarColuna = document.createElement("form");
    formCriarColuna.classList.add("vertical-form");
    dialogo.appendChild(formCriarColuna);

    // Definir ponto de inserção
    const divInserirInicio = document.createElement("div");
    const inputInserirInicio = document.createElement("input");
    const labelInserirInicio = document.createElement("label");

    const divInserirApos = document.createElement("div");
    const inputInserirApos = document.createElement("input");
    const labelInserirApos = document.createElement("label");
    const seletorInserirApos = document.createElement("select");

    inputInserirInicio.name = "selecionar-pos-coluna";
    inputInserirInicio.type = "radio";
    inputInserirInicio.id = "inserir-coluna-inicio";
    inputInserirInicio.checked = true;
    labelInserirInicio.innerText = "Inserir coluna no início";
    divInserirInicio.append(inputInserirInicio, labelInserirInicio);
    divInserirInicio.classList.add("container-radio-button");

    inputInserirApos.name = "selecionar-pos-coluna";
    inputInserirApos.type = "radio";
    inputInserirApos.id = "inserir-coluna-apos";
    labelInserirApos.innerText = "Inserir coluna após: ";
    divInserirApos.append(inputInserirApos, labelInserirApos, seletorInserirApos);
    divInserirApos.classList.add("container-radio-button");

    // Obter nomes das colunas atuais e incluir no seletor
    for (const coluna of quadroView.quadro?.colunas || []) {
        const opcaoColuna = document.createElement("option");
        opcaoColuna.value = coluna.ordemColuna.toString();
        opcaoColuna.innerText = coluna.nomeColuna;

        seletorInserirApos.appendChild(opcaoColuna);
    }

    // Definir nome da coluna
    const inputNomeColuna = document.createElement("input");
    const labelNomeColuna = document.createElement("label");

    labelNomeColuna.textContent = "Nome da nova coluna";
    labelNomeColuna.htmlFor = "nome-nova-coluna";

    inputNomeColuna.id = "nome-nova-coluna";

    // Botão de salvar
    const botaoSalvar = document.createElement("button");
    botaoSalvar.type = "submit";
    botaoSalvar.textContent = "Salvar";
    const __criarColuna = async (e: MouseEvent) => {
        e.preventDefault();
        try {
            await criarNovaColuna(quadroView.idQuadro as string,
                inputNomeColuna.value,
                inputInserirApos.checked ? parseInt(seletorInserirApos.value) : 1);
        } catch (error) {
            console.error("Erro ao atualizar tarefa:", error);
        } finally {
            dialogo.removeChild(formCriarColuna);
            dialogo.close();
            recarregarQuadro(quadroView);
        }
    }
    botaoSalvar.addEventListener("click", __criarColuna);

    // Botão de cancelar
    const botaoCancelar = document.createElement("button");
    botaoCancelar.textContent = "Cancelar";
    botaoCancelar.classList.add("bg-vermelho");
    botaoCancelar.addEventListener("click", () => {
        dialogo.removeChild(formCriarColuna);
        dialogo.close();
    });

    // Container dos botões
    const botaoContainer = document.createElement("div");
    botaoContainer.classList.add("botoes-container");
    botaoContainer.append(botaoCancelar, botaoSalvar);

    formCriarColuna.append(divInserirInicio,
        divInserirApos,
        labelNomeColuna,
        inputNomeColuna,
        botaoContainer);
    dialogo.showModal();
}


export async function abrirEditorTarefa(e: Event, quadroView: QuadroView) {
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

    const dadosTarefa = await buscarDadosTarefaService.buscarDadosTarefa(idTarefa) as Tarefa;
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

    try {
        async function __editarTarefa(e: MouseEvent) {
            e.preventDefault();
            console.log(quadroView);
            try {
                await editarTarefaService.editarTarefa(
                    idTarefa,
                    dadosTarefa.idColuna,
                    inputTitulo.value,
                    inputDescricao.value,
                    dadosTarefa.tags
                );
            } catch (error) {
                console.error("Erro ao atualizar tarefa:", error);
            } finally {
                dialogo.removeChild(formEditarTarefa);
                dialogo.close();
                recarregarQuadro(quadroView);
            }
        }
        botaoSalvar.addEventListener("click", __editarTarefa);

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

        formEditarTarefa.append(
            labelTitulo,
            inputTitulo,
            labelDescricao,
            inputDescricao,
            botaoContainer
        );

        dialogo.appendChild(formEditarTarefa);
        dialogo.showModal();
    } catch (error) {
        console.error("Erro ao buscar dados da tarefa:", error);
    }
}



export function abrirCriadorTarefa(e: Event, quadroView: QuadroView) {
    let idColuna: string | undefined;
    if (e.target instanceof HTMLElement) {
        let current = e.target;
        while (current.parentElement) {
            if (current.dataset.idColuna !== undefined) {
                idColuna = current.dataset.idColuna;
                break;
            }
            current = current.parentElement;
        }
    }

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
    if (idColuna !== undefined) {
        seletorColuna.value = idColuna;
    }

    // Botão de salvar
    botaoSalvar.type = "submit";
    botaoSalvar.textContent = "Salvar";
    const __criarTarefa = async (e: MouseEvent) => {
        e.preventDefault();
        try {
            await criarTarefaService.criarTarefa(inputTitulo.value, inputDescricao.value, seletorColuna.value);
        } catch (error) {
            console.error("Erro ao atualizar tarefa:", error);
        } finally {
            dialogo.removeChild(formCriarTarefa);
            dialogo.close();
            recarregarQuadro(quadroView);
        }
    }
    botaoSalvar.addEventListener("click", __criarTarefa);

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
