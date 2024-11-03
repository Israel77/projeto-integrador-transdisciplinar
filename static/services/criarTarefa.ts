import { appConfig } from "/config.js";

export async function criarTarefa(titulo: string, descricao: string, idColuna: string) {
    await fetch(`${appConfig.baseApiUrl}/api/v1/tarefa/criar`, {
        method: "PUT",
        credentials: "include",
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