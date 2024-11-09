import { criarNovaColuna } from "/services/criarNovaColuna.js";
import { type QuadroView, recarregarQuadro } from "/pages/main/quadro.js";

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
                inputInserirApos.checked ? parseInt(seletorInserirApos.value) + 1 : 1);
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