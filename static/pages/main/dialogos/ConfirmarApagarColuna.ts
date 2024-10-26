import { apagarColuna } from "../../../services/apagarColuna.js";
import { QuadroView } from "../quadro.js";

export function abrirDialogoApagarColuna(quadroView: QuadroView,
    colunaContainer: HTMLElement,
    colunaDiv: HTMLElement,
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
            apagarColuna(idColuna);
            colunaContainer.removeChild(colunaDiv);
            if (quadroView.quadro) {
                quadroView.quadro.colunas = quadroView.quadro.colunas.filter(
                    coluna => coluna.idColuna != idColuna
                )
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