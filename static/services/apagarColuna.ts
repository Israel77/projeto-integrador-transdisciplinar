import { appConfig } from "/config.js";

export async function apagarColuna(idColuna: string) {
    return await fetch(`${appConfig.baseApiUrl}/api/v1/coluna/apagar`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            idColuna,
        })
    });
}