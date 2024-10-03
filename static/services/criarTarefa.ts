export async function criarTarefa(titulo: string, descricao: string, idColuna: string) {
    await fetch(`api/v1/tarefa/criar`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            titulo,
            descricao,
            idColuna
        })
    });
}