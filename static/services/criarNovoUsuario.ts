import { appConfig } from "/config.js";

export async function criarNovoUsuario(nomeUsuario: string, emailUsuario: string, senha: string) {
    return await fetch(`${appConfig.baseApiUrl}/api/v1/sign-up`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nomeUsuario,
            emailUsuario,
            senha
        })
    }) as Omit<Response, 'json'> & {
        json: () => Promise<{
            idUsuario: string,
        }>
    };
}