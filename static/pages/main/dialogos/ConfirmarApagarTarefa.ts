import { deletarTarefa } from "/services/deletarTarefa.js";
import { type QuadroView } from "/pages/main/quadro";

export function abrirDialogoApagarTarefa(quadroView: QuadroView,
    colunaDiv: HTMLElement,
    tarefaDiv: HTMLElement,
    idTarefa: string,
    tituloTarefa: string) {
    const dialogo = document.getElementById("modal") as HTMLDialogElement;

    const formApagarTarefa = document.createElement("form");

    const pTextoConfirmacao = document.createElement("p");
    pTextoConfirmacao.innerText = `Tem certeza que deseja apagar a tarefa "${tituloTarefa}"?`;

    // Botão de salvar
    const botaoApagar = document.createElement("button");
    botaoApagar.type = "submit";
    botaoApagar.textContent = "Apagar";
    botaoApagar.classList.add("bg-vermelho");

    async function __editarTarefa(e: MouseEvent) {
        e.preventDefault();
        console.log(quadroView);
        try {
            await deletarTarefa(idTarefa);
            colunaDiv.removeChild(tarefaDiv);
        } catch (error) {
            console.error("Erro ao apagar a tarefa:", error);
        } finally {
            dialogo.removeChild(formApagarTarefa);
            dialogo.close();
        }
    }
    botaoApagar.addEventListener("click", __editarTarefa);

    // Botão de cancelar
    const botaoCancelar = document.createElement("button");
    botaoCancelar.textContent = "Cancelar";
    botaoCancelar.classList.add("ghost-button");
    botaoCancelar.addEventListener("click", () => {
        dialogo.removeChild(formApagarTarefa);
        dialogo.close();
    });


    // Container dos botões
    const botaoContainer = document.createElement("div");
    botaoContainer.classList.add("botoes-container");
    botaoContainer.append(botaoCancelar, botaoApagar);

    formApagarTarefa.append(
        pTextoConfirmacao,
        botaoContainer
    );

    dialogo.appendChild(formApagarTarefa);
    dialogo.showModal();
}