import { appConfig } from "/config.js";

export async function criarNovoQuadro(tituloQuadro: string, descricaoQuadro: string, nomesColunas: string[]) {
    return await fetch(`${appConfig.baseApiUrl}/api/v1/quadro/criar`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            tituloQuadro,
            descricaoQuadro,
            nomesColunas
        })
    }) as Omit<Response, 'json'> & {
        json: () => Promise<{
            idQuadro: string,
        }>
    };
}