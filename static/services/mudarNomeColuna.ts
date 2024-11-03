import { appConfig } from "/config.js";

export async function mudarNomeColuna(idColuna: string, novoNome: string) {
    fetch(`${appConfig.baseApiUrl}/api/v1/coluna/atualizar/nome`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            idColuna,
            novoNome
        })
    });
}
