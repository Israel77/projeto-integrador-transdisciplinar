import { criarNovoQuadro } from "../../services/criarNovoQuadro.js";
import { fazerLogout } from "../../services/fazerLogout.js";
import { renderizarLista } from "./ListaColunas.js";

(() => {
    renderizarFormulario();
    handleLinkVoltar();
})()

function renderizarFormulario() {
    const tituloQuadroInput = document.getElementById("titulo-quadro") as HTMLInputElement;
    const descricaoQuadroInput = document.getElementById("descricao-quadro") as HTMLTextAreaElement;

    const listaColunas = [
        {
            nomeColuna: "Backlog",
            ordemColuna: 1
        },
        {
            nomeColuna: "Em andamento",
            ordemColuna: 2
        },
        {
            nomeColuna: "Concluídas",
            ordemColuna: 3
        },
    ]
    const listaColunasDiv = document.getElementById("criar-colunas");

    if (listaColunasDiv === null) {
        console.error("Não foi possível renderizar a lista de colunas pois falta o elemento raiz");
        return;
    } else {
        renderizarLista(listaColunasDiv, listaColunas);
    }

    const formCriarQuadro = document.getElementById("formulario-criar-quadro");
    formCriarQuadro?.addEventListener("submit", (e: MouseEvent) => {
        e.preventDefault()

        criarNovoQuadro(tituloQuadroInput.value, descricaoQuadroInput.value, listaColunas.map(coluna => coluna.nomeColuna)).then(resposta => {
            if (resposta.ok) {
                window.location.href = `/main`;
            }
        });
    });
}

function handleLinkVoltar() {
    const linkVoltarInicio = document.getElementById("link-voltar");

    linkVoltarInicio?.addEventListener("click", async (e) => {
        e.preventDefault();
        await fazerLogout();
        window.location.href = "/";
    });
}