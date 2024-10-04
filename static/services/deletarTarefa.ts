export async function deletarTarefa(idTarefa: string) {
    return await fetch(`/api/v1/tarefa/${idTarefa}`, {
        method: "DELETE"
    });
}