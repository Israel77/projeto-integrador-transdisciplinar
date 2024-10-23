import { appConfig } from "../config.js";

export async function criarNovaColuna(idQuadro: string, nomeColuna: string, ordemColuna: number) {
    return await fetch(`${appConfig.baseApiUrl}/api/v1/coluna/criar`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            idQuadro,
            ordemColuna,
            nomeColuna,
        })
    }) as Omit<Response, 'json'> & {
        json: () => Promise<{
            idQuadro: string,
            idUsuario: string,
            idColuna: string,
            ordemColuna: number
        }>
    };
}