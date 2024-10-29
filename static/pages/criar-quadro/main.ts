import { renderizarLista } from "./ListaColunas.js";

(() => {
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
    formCriarQuadro?.addEventListener("click", (e: MouseEvent) => e.preventDefault());

})()