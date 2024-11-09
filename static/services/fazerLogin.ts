import { appConfig } from "/config.js";
import { MensagemErro, Quadro, RequisicaoLogin } from "/types/types";

type RespostaLogin = {
    id: string;
    nomeUsuario: string;
    quadros: Quadro[];
}

export function fazerLogin(requisicao: RequisicaoLogin) {
    return fetch(`${appConfig.baseApiUrl}/api/v1/login`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(requisicao),
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        }
    }) as Promise<Omit<Response, 'json'> & {
        json(): Promise<RespostaLogin | MensagemErro>;
    }>;
}