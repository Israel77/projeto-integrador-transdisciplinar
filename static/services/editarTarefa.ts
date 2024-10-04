import { appConfig } from "../config.js";
import type { Tag } from "../types/types";

export async function editarTarefa(idTarefa: string | undefined, idColuna: string, titulo: string, descricao: string, tags?: Tag[]) {
    await fetch(`${appConfig.baseApiUrl}/api/v1/tarefa/atualizar`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            idTarefa,
            titulo,
            descricao,
            tags,
            idColuna
        })
    });
}