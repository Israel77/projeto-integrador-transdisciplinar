import { apagarColuna } from "/services/apagarColuna.js";
import { atualizarView, QuadroView } from "/main/quadro.js";

export function abrirDialogoApagarColuna(quadroView: QuadroView,
    idColuna: string,
    nomeColuna: string) {

    const dialogo = document.getElementById("modal") as HTMLDialogElement;

    const formApagarColuna = document.createElement("form");

    const pTextoConfirmacao = document.createElement("p");
    pTextoConfirmacao.innerText = `Tem certeza que deseja apagar a coluna "${nomeColuna}"?`;

    // Botão de salvar
    const botaoApagar = document.createElement("button");
    botaoApagar.type = "submit";
    botaoApagar.textContent = "Apagar";
    botaoApagar.classList.add("bg-vermelho");

    async function __editarTarefa(e: MouseEvent) {
        e.preventDefault();
        console.log(quadroView);
        try {
            await apagarColuna(idColuna);

            // Insere as tarefas na primeira coluna do quadro
            if (quadroView.quadro) {
                const colunaIndex = quadroView.quadro
                    .colunas
                    .findIndex(coluna => coluna.idColuna == idColuna);
                const tarefas = quadroView.quadro.colunas[colunaIndex].tarefas;

                let tarefa = tarefas?.pop();
                while (tarefa !== undefined) {
                    tarefa &&
                        // Se a coluna a ser removida for a primeira, inserir
                        // tarefas na segunda coluna
                        quadroView.quadro.colunas[colunaIndex !== 0 ? 0 : 1]
                            .tarefas
                            .push(tarefa);

                    tarefa = tarefas?.pop();
                }
                quadroView.quadro.colunas.splice(colunaIndex, 1);
                atualizarView(quadroView);
            }
        } catch (error) {
            console.error("Erro ao apagar a tarefa:", error);
        } finally {
            dialogo.removeChild(formApagarColuna);
            dialogo.close();
        }
    }
    botaoApagar.addEventListener("click", __editarTarefa);

    // Botão de cancelar
    const botaoCancelar = document.createElement("button");
    botaoCancelar.textContent = "Cancelar";
    botaoCancelar.classList.add("ghost-button");
    botaoCancelar.addEventListener("click", () => {
        dialogo.removeChild(formApagarColuna);
        dialogo.close();
    });


    // Container dos botões
    const botaoContainer = document.createElement("div");
    botaoContainer.classList.add("botoes-container");
    botaoContainer.append(botaoCancelar, botaoApagar);

    formApagarColuna.append(
        pTextoConfirmacao,
        botaoContainer
    );

    dialogo.appendChild(formApagarColuna);
    dialogo.showModal();
}