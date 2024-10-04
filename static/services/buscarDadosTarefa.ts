import { appConfig } from "../config.js";
import type { MensagemErro, Tarefa } from "../types/types";

export const buscarDadosTarefa = async (idTarefa: string) => {
    const resposta = await fetch(`${appConfig.baseApiUrl}/api/v1/tarefa/${idTarefa}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (resposta.ok) {
        const corpoResposta = await resposta.json() as Tarefa;
        return corpoResposta;
    } else {
        const corpoResposta = await resposta.json() as MensagemErro;
        console.error(corpoResposta.message);
        return null;
    }
}