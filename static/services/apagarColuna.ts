import { appConfig } from "/config.js";

export async function apagarColuna(idColuna: string) {
    return fetch(`${appConfig.baseApiUrl}/api/v1/coluna/apagar`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        mode: "cors",
        body: JSON.stringify({
            idColuna,
        })
    });
}