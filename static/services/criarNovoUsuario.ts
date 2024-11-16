import { appConfig } from "/config.js";
import { MensagemErro } from "/types/types";

export async function criarNovoUsuario(nomeUsuario: string, emailUsuario: string, senha: string) {
    return await fetch(`${appConfig.baseApiUrl}/api/v1/sign-up`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        mode: "cors",
        body: JSON.stringify({
            nomeUsuario,
            emailUsuario,
            senha
        })
    }) as Omit<Response, 'json'> & {
        json: () => Promise<{
            idUsuario: string,
        } | MensagemErro>
    };
}