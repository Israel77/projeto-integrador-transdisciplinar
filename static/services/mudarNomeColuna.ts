
export async function mudarNomeColuna(idColuna: string, novoNome: string) {
    fetch(`/api/v1/coluna/atualizar/nome`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            idColuna,
            novoNome
        })
    });
}
