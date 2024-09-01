
export function criarTag(root: HTMLElement, tag: Tag) {
    // Criação
    let tagElement = document.createElement("span");

    // Inserção
    root.appendChild(tagElement);

    // Estilo
    tagElement.classList.add("tag")

    // Dados
    tagElement.innerText = tag;

    return tagElement
}