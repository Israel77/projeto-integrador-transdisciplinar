import { type Tarefa } from "/types/types";
import { QuadroView, recarregarQuadro } from "/pages/main/quadro.js";
import * as editarTarefaService from "/services/editarTarefa.js";
import * as buscarDadosTarefaService from "/services/buscarDadosTarefa.js";

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

    // Seletor da coluna
    const seletorColuna = document.createElement("select");
    seletorColuna.id = "seletor-coluna";
    seletorColuna.name = "coluna";
    for (const coluna of quadroView.quadro?.colunas || []) {
        const opcao = document.createElement("option");
        opcao.value = coluna.idColuna;
        opcao.textContent = coluna.nomeColuna;
        seletorColuna.appendChild(opcao);
    }
    //Valor padrão
    seletorColuna.value = dadosTarefa.idColuna;

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
                    seletorColuna.value,
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
            seletorColuna,
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