import { appConfig } from "../config.js";
import type { MensagemErro } from "../types/types.d.ts";

export type RespostaLogin = {
    id: string;
    quadros: string[];
}

export const verificarLogin = async (): Promise<RespostaLogin | MensagemErro> => {
    const resposta = await fetch(`${appConfig.baseApiUrl}/api/v1/verificar-login`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    return await resposta.json() as RespostaLogin | MensagemErro;
}