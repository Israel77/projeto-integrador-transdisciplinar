import { appConfig } from "/config.js";

export async function deletarTarefa(idTarefa: string) {
    return await fetch(`${appConfig.baseApiUrl}/api/v1/tarefa/${idTarefa}`, {
        method: "DELETE",
        credentials: "include",
        mode: "cors",
    });
}