/**
 * Renderiza uma lista de colunas em um elemento HTML raiz.
 * Assume que a lista de colunas é a única informação que deve
 * estar contida na raiz (pode apagar outros elementos, caso existam)
 * 
 * @param root - Elemento HTML onde as colunas serão renderizadas
 * @param colunas - Array de objetos contendo informações das colunas
 * @param colunas[].nomeColuna - Nome da coluna
 * @param colunas[].ordemColuna - Ordem numérica da coluna
 */
export function renderizarLista(root: Element, colunas: {
    nomeColuna: string,
    ordemColuna: number
}[]) {
    root.innerHTML = "";
    console.log(`Número de colunas: ${colunas.length}`);
    for (const coluna of colunas) {
        console.log(`Renderizando: `, coluna);
        const itemContainer = document.createElement("div");
        const botoesContainer = document.createElement("div");
        const inputNomeColuna = document.createElement("input");
        const botaoSubir = document.createElement("button");
        const botaoDescer = document.createElement("button");
        const botaoNovaColuna = document.createElement("button");
        const botaoRemoverColuna = document.createElement("button");

        inputNomeColuna.value = coluna.nomeColuna;
        botaoSubir.innerText = "^";
        botaoDescer.innerText = "v";
        botaoNovaColuna.innerText = "+";
        botaoRemoverColuna.innerText = "-";

        itemContainer.classList.add("lista-container");
        botoesContainer.classList.add("btn-container");
        botaoNovaColuna.classList.add("bg-verde");
        botaoRemoverColuna.classList.add("bg-vermelho");
        botaoSubir.disabled = coluna.ordemColuna <= 1;
        botaoDescer.disabled = coluna.ordemColuna >= colunas.length;

        inputNomeColuna.addEventListener("input", () => {
            coluna.nomeColuna = inputNomeColuna.value;
        })
        botaoSubir.addEventListener("click", (e: MouseEvent) => {
            e.stopPropagation();
            if (coluna.ordemColuna > 1) {
                decrementar(coluna.ordemColuna, colunas);
                renderizarLista(root, colunas)
            }
        });
        botaoDescer.addEventListener("click", (e: MouseEvent) => {
            e.stopPropagation();
            if (coluna.ordemColuna < colunas.length) {
                incrementar(coluna.ordemColuna, colunas);
                renderizarLista(root, colunas)
            }
        });
        botaoNovaColuna.addEventListener("click", (e: MouseEvent) => {
            e.stopPropagation();
            criarNovaColunaApos(coluna.ordemColuna, colunas);
            renderizarLista(root, colunas);
        })
        botaoRemoverColuna.addEventListener("click", (e: MouseEvent) => {
            e.stopPropagation();
            removerColuna(coluna.ordemColuna, colunas);
            renderizarLista(root, colunas);
        })

        botoesContainer.append(botaoSubir, botaoDescer, botaoNovaColuna, botaoRemoverColuna);
        itemContainer.append(inputNomeColuna, botoesContainer);
        root.append(itemContainer);
    }
}

function decrementar(ordemColunaOriginal: number, colunas: {
    nomeColuna: string,
    ordemColuna: number
}[]) {
    // Converte de 1-index para 0-index para facilitar
    // a implementação do algoritmo.
    const index = ordemColunaOriginal - 1;

    // Faz um swap da ordemColuna da coluna atual
    // e anterior
    colunas[index].ordemColuna = ordemColunaOriginal - 1;
    colunas[index - 1].ordemColuna = ordemColunaOriginal;

    [colunas[index], colunas[index - 1]] = [colunas[index - 1], colunas[index]];
}

function incrementar(ordemColunaOriginal: number, colunas: {
    nomeColuna: string,
    ordemColuna: number
}[]) {
    // Converte de 1-index para 0-index para facilitar
    // a implementação do algoritmo.
    const index = ordemColunaOriginal - 1;

    // Faz um swap da ordemColuna da coluna atual
    // e posterior
    colunas[index].ordemColuna = ordemColunaOriginal + 1;
    colunas[index + 1].ordemColuna = ordemColunaOriginal;

    [colunas[index], colunas[index + 1]] = [colunas[index + 1], colunas[index]];
}

function criarNovaColunaApos(ordemColunaOriginal: number, colunas: {
    nomeColuna: string,
    ordemColuna: number
}[]) {
    const novaColuna = {
        nomeColuna: "",
        ordemColuna: ordemColunaOriginal + 1
    };

    // Ponto de inserção = (ordemColunaOriginal - 1) + 1 = ordemColunaOriginal
    colunas.splice(ordemColunaOriginal, 0, novaColuna);

    for (const coluna of colunas.slice(ordemColunaOriginal + 1)) {
        coluna.ordemColuna += 1;
    }
}

function removerColuna(ordemColunaOriginal: number, colunas: {
    nomeColuna: string,
    ordemColuna: number
}[]) {
    // Ponto de remoção = ordemColunaOriginal - 1 (0-based index)
    colunas.splice(ordemColunaOriginal - 1, 1);

    for (const coluna of colunas.slice(ordemColunaOriginal - 1)) {
        coluna.ordemColuna -= 1;
    }
}