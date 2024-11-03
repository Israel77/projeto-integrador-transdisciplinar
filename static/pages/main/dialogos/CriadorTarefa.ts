import { QuadroView, recarregarQuadro } from "/main/quadro.js";
import * as criarTarefaService from "/services/criarTarefa.js";

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